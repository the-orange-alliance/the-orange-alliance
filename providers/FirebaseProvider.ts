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

const baseUrl = 'https://functions.theorangealliance.org';
// const baseUrl = 'http://localhost:5000/the-orange-alliance/us-central1/requireValidations'; // Tests Only

const firebaseConfig = {
  apiKey: 'AIzaSyBi0Bn_WysaX9DSnpo-E5c-q0O6XBX7T_k',
  authDomain: 'the-orange-alliance.firebaseapp.com',
  databaseURL: 'https://the-orange-alliance.firebaseio.com',
  projectId: 'the-orange-alliance',
  storageBucket: 'the-orange-alliance.appspot.com',
  messagingSenderId: '495169296462',
  appId: '1:495169296462:web:a8543d9517ea3cea4e0b1f'
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
      .then(() => {})
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

export const fetchUserData = (type?: string): Promise<TOAUser> => {
  return new Promise<TOAUser>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          ...(type ? { data: type } : {})
        };

        fetch(baseUrl + '/user', { headers: headers })
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

const getShortUserData = (): Promise<TOAUser> => {
  return new Promise<TOAUser>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          short: 'true'
        };

        fetch(baseUrl + '/user', { headers: headers })
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

export const generateApiKey = (): Promise<{ key: string }> => {
  return new Promise<{ key: string }>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`
        };

        fetch(baseUrl + '/generateKey', { headers: headers })
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

const addToFavorite = (key: string, type: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: type
        };

        fetch(baseUrl + '/user/addFavorite', { headers: headers, method: 'POST', body: key })
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

const removeFromFavorite = (key: string, type: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: type
        };

        fetch(baseUrl + '/user/removeFavorite', {
          headers: headers,
          method: 'POST',
          body: key
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

export const updateEvent = (event: Event): Promise<any> => {
  const json = event.toJSON() as any;
  delete json.matches;
  delete json.rankings;
  delete json.awards;
  delete json.teams;
  delete json.alliances;
  delete json.insights;
  json.is_active = true;
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: event.eventKey
        };

        fetch(baseUrl + '/updateEvent', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify([json])
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

const getPendingMedia = (): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`
        };

        fetch(baseUrl + '/getPendingMedia', { headers: headers })
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

export const addStream = (stream: EventLiveStream): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`
        };

        fetch(baseUrl + '/addStream', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify([stream.toJSON()])
        })
          .then(data => data.text())
          .then(
            (data: string) => {
              resolve(data === 'Success');
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

export const hideStream = (stream: EventLiveStream): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`
        };

        fetch(baseUrl + '/hideStream', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify([stream.toJSON()])
        })
          .then(data => data.text())
          .then(
            (data: string) => {
              resolve(data === 'Success');
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

const eventsRetriever = (year: number): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: `${year}`
        };

        fetch(baseUrl + '/firstEvents', { headers: headers })
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

const teamsRetriever = (year: string): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: `${year}`
        };

        fetch(baseUrl + '/firstTeams', { headers: headers })
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

const getEventSettings = (eventKey: string): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: eventKey
        };

        fetch(baseUrl + '/user/getEventSettings', { headers: headers })
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

const updateEventSettings = (eventKey: string, settings: any): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: eventKey
        };

        fetch(baseUrl + '/user/updateEventSettings', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify(settings)
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

const saveMessagingToken = (messagingToken: string): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`
        };

        fetch(baseUrl + '/user/saveMessagingToken', {
          headers: headers,
          method: 'POST',
          body: messagingToken
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
