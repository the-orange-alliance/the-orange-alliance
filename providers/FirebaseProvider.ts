import * as firebase from 'firebase/app';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  linkWithPopup,
  unlink,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  updateEmail
} from 'firebase/auth';
import { getDatabase, ref, set as dbSet } from 'firebase/database';
import TOAUser from '../lib/TOAUser';
import { Event, EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import toast from 'react-hot-toast';
import localforage from "localforage";
import { getMessaging, getToken as getMessagingToken, onMessage } from "firebase/messaging";

const baseUrl = 'https://functions.theorangealliance.org';
// const baseUrl = 'http://localhost:5000/the-orange-alliance/us-central1/requireValidations'; // Tests Only
const toaBaseUrl = 'https://api.theorangealliance.org';
// const toaBaseUrl = 'http://localhost:8008/api';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
let app = firebase.initializeApp(firebaseConfig);

let auth = getAuth(app);
let db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const getAuthInstance = () => {
  if (!app) app = firebase.initializeApp(firebaseConfig);
  if (!auth) auth = getAuth(app);
  if (!db) db = getDatabase(app);
  return auth;
};

export const inStartupState = () => {
  return !app || !auth || !db;
};

export const logout = () => {
  return auth.signOut();
};

export const linkProvider = (provider: 'github' | 'google') => {
  if (!auth.currentUser) return new Promise((resolve, reject) => reject());
  const prov = provider === 'github' ? githubProvider : googleProvider;
  return linkWithPopup(auth.currentUser, prov);
};

export const unlinkProvider = (provider: 'github' | 'google') => {
  if (!auth.currentUser) return new Promise((resolve, reject) => reject());
  const prov = provider === 'github' ? githubProvider : googleProvider;
  return unlink(auth.currentUser, prov.providerId);
};

export const sendPasswordReset = () => {
  if (!auth.currentUser) return new Promise((resolve, reject) => reject());
  if (!auth.currentUser.email) return new Promise((resolve, reject) => reject('No email'));
  return sendPasswordResetEmail(auth, auth.currentUser.email);
};

export const signUp = (email: string, name: string, password: string, team: string) => {
  return createUserWithEmailAndPassword(auth, email, password).then(user => {
    updateProfile(user.user, { displayName: name, photoURL: null }).catch(error =>
      console.log(error)
    );
    const data = {} as any;
    data['fullName'] = name;
    if (team && team.trim().length > 0) {
      data['team'] = team;
    }
    const dbRef = ref(db, `Users/${user.user.uid}`);
    return dbSet(dbRef, data).then(value => {
      return sendEmailVerification(user.user);
    });
  });
};

export const changeDisplayName = (name: string) => {
  if (auth.currentUser != null) {
    updateProfile(auth.currentUser, { displayName: name })
      .then(() => { })
      .catch(error => console.log(error));
  }
};

export const changeEmail = (email: string) => {
  if (auth.currentUser != null) {
    let successful = true;
    updateEmail(auth.currentUser, email)
      .catch(() => {
        successful = false;
      })
      .then(() => {
        if (auth.currentUser != null) {
          sendEmailVerification(auth?.currentUser);
        }
      });

    return successful;
  }

  return false;
};

export const loginWithGoogle = async () => {
  await setPersistence(auth, browserLocalPersistence);
  return new Promise<void>((resolve, reject) => {
    signInWithPopup(auth, googleProvider)
      .then(() => {
        resolve();
      })
      .catch((err: any) => reject(err));
  });
};

export const loginWithGithub = async () => {
  await setPersistence(auth, browserLocalPersistence);
  return new Promise<void>((resolve, reject) => {
    signInWithPopup(auth, githubProvider)
      .then(() => {
        resolve();
      })
      .catch((err: any) => reject(err));
  });
};

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  await setPersistence(auth, browserLocalPersistence);
  return new Promise<void>((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        resolve();
      })
      .catch((err: any) => reject(err));
  });
};

export const isLoggedIn = () => {
  return auth.currentUser !== null;
};

const getToken = (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const user = auth.currentUser;
    if (user === null) {
      reject();
    } else {
      user
        .getIdToken(false)
        .then((token: string) => {
          resolve(token);
        })
        .catch((err: any) => {
          reject(err);
        });
    }
  });
};

export const fetchUserData = (type?: string): Promise<TOAUser> => {
  return new Promise<TOAUser>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          ...(type ? { data: type } : {})
        };

        fetch(toaBaseUrl + '/user', { headers: headers })
          .then(data => {
            if (data.status === 428) {
              toast.error('Please verify your email to continue!');
            } else {
              return data.json();
            }
          })
          .then(
            (data: any) => {
              if (data) {
                resolve(new TOAUser().fromJSON(data));
              } else {
                reject();
              }
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const addToFavorite = (key: string, type: "event" | "team"): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const body = { [type === "event" ? "event_key" : "team_key"]: key }

        fetch(toaBaseUrl + '/user/addFavorite', { headers: headers, method: 'POST', body: JSON.stringify(body) })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const removeFromFavorite = (key: string, type: "team" | "event"): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const body = { [type === "event" ? "event_key" : "team_key"]: key }

        fetch(toaBaseUrl + '/user/removeFavorite', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify(body)
        })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const updateEvent = (event: Event): Promise<boolean> => {
  const json = event.toJSON() as any;
  delete json.matches;
  delete json.rankings;
  delete json.awards;
  delete json.teams;
  delete json.alliances;
  delete json.insights;
  if (json.league_key === null) delete json.league_key;
  if (json.division_name === null) delete json.division_name;
  if (json.website === null) delete json.website;
  json.is_active = true;
  return new Promise<boolean>((resolve, reject) => {
    getToken().then(token => {
      const headers = {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      fetch(toaBaseUrl + '/user/actions/updateEvent', { headers: headers, method: 'POST', body: JSON.stringify([json]) }).then(res => {
        if (res.ok) {
          resolve(true);
        } else {
          reject(res);
        }
      });
    }).catch((err: any) => {
      reject(err);
    });
  });
};

export const addEventMedia = (mediaData: any): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: 'event'
        };

        fetch(baseUrl + '/addMedia', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify(mediaData)
        })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const updateStream = (stream: EventLiveStream): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        fetch(toaBaseUrl + '/user/actions/updateStream', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify([stream.toJSON()])
        }).then(res => {
          if (res.ok) {
            resolve(true);
          } else {
            reject(res);
          }
        });
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const setNotifications = (type: "team" | "event", key: string, notify: boolean): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }

        fetch(toaBaseUrl + '/user/setNotifications', {
          headers,
          method: 'POST',
          body: JSON.stringify({ [type + "_key"]: key, enabled: notify })
        })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

const toaPost = (body: any, route: string): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: route
        };

        fetch(baseUrl + '/toaapi', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify(body)
        })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              if (err.status === 200) {
                resolve(err);
              } else {
                reject(err);
              }
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

const toaPut = (body: any, route: string): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: route
        };

        fetch(baseUrl + '/toaapi', {
          headers: headers,
          method: 'PUT',
          body: JSON.stringify(body)
        })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              if (err.status === 200) {
                resolve(err);
              } else {
                reject(err);
              }
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

const toaDelete = (route: string): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: route
        };

        fetch(baseUrl + '/toaapi', { headers: headers, method: 'DELETE' })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              if (err.status === 200) {
                resolve(err);
              } else {
                reject(err);
              }
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

const addTeamMedia = (mediaData: any): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: 'team'
        };

        fetch(baseUrl + '/addMedia', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify(mediaData)
        })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

const addMediaToPending = (mediaData: {
  event_key: string | undefined;
  team_key: string | undefined;
  [key: string]: any;
}): Promise<any> => {
  let dataHeader: any;
  if (mediaData.team_key && mediaData.team_key.toString().length > 0 && !mediaData.event_key) {
    dataHeader = 'team';
  } else if (mediaData.event_key && mediaData.event_key.length > 0 && !mediaData.team_key) {
    dataHeader = 'event';
  } else {
    return new Promise<any>((resolve, reject) => {
      reject('No Team or Event is Defined! (Or both are defined!)');
    });
  }

  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: dataHeader
        };

        fetch(baseUrl + '/addMediaToPending', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify(mediaData)
        })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

const addSuggestion = (suggestionData: any): Promise<any> => {
  let dataHeader: any;
  if (suggestionData.match_key !== undefined && suggestionData.event_key === undefined) {
    dataHeader = 'add_match_video';
  } else if (suggestionData.match_key === undefined && suggestionData.event_key !== undefined) {
    dataHeader = 'add_event_stream';
  } else {
    return new Promise<any>((resolve, reject) => {
      reject('No Suggestion Data is Defined! (Or both types are defined!)');
    });
  }

  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: dataHeader
        };

        fetch(baseUrl + '/user/addSuggestion', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify(suggestionData)
        })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

const getShortUserData = (): Promise<TOAUser> => {
  return new Promise<TOAUser>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          short: 'true'
        };

        fetch(toaBaseUrl + '/user', { headers: headers })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(new TOAUser().fromJSON(data));
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};


const generateEventApiKey = (eventKey: string): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: eventKey
        };

        fetch(baseUrl + '/eventKey', { headers: headers })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data.key);
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

const playlistMatchify = (eventKey: string, playlistID: string): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: eventKey
        };

        const body = {
          playlistID: playlistID
        };

        fetch(baseUrl + '/playlistMatchify', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify(body)
        })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

const setVideos = (eventKey: string, videos: any[]): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: eventKey
        };

        fetch(baseUrl + '/setVideos', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify(videos)
        })
          .then(data => data.json())
          .then(
            (data: any) => {
              resolve(data);
            },
            (err: any) => {
              reject(err);
            }
          );
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};


/** Cloud Messaging Stuff **/

const saveMessagingToken = (key: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getToken().then(token => {
      const headers = {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const body = { token: key };

      fetch(toaBaseUrl + '/user/saveMessagingToken', { headers: headers, method: 'POST', body: JSON.stringify(body) })
        .then(data => data.json())
        .then(
          (data: any) => {
            resolve(data);
          },
          (err: any) => {
            reject(err);
          }
        ).catch(reject);
    });
  });
};

const removeMessagingToken = (key: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getToken().then(token => {
      const headers = {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const body = { token: key };

      fetch(toaBaseUrl + '/user/removeMessagingToken', { headers: headers, method: 'POST', body: JSON.stringify(body) })
        .then(data => data.json())
        .then(
          (data: any) => {
            resolve(data);
          },
          (err: any) => {
            reject(err);
          }
        ).catch(reject);
    });
  });
};

export const cloudMessaging = {
  tokenInlocalforage: async () => {
    return await localforage.getItem("fcm_token");
  },
  onMessage: async () => {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      if (payload.notification?.title) toast(payload.notification.title)
    });
  },
  disable: async function () {
    try {
      const currToken = await this.tokenInlocalforage();
      if (currToken !== null) {
        await removeMessagingToken(currToken);
      }
    } catch (err) {
      throw err;
    }
  },
  init: function () {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        // Check if we have a messaging token
        if ((await this.tokenInlocalforage()) !== null) {
          resolve(false);
        }

        // Get permission to send notifications
        const messaging = getMessaging(app);
        await Notification.requestPermission();

        // Get token
        getMessagingToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID }).then(async (currentToken) => {
          try {
            if (currentToken) {
              // Send the token to your server and update the UI if necessary
              await saveMessagingToken(currentToken);
              // save the token in your database
              localforage.setItem("fcm_token", currentToken);
              resolve(true)
            } else {
              reject("No Token");
            }
          } catch (error) {
            reject(error);
          }
        }).catch(reject);
      } catch (error) {
        reject(error)
      }
    });
  },
};