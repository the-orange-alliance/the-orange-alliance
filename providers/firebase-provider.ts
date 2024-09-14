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
import { getDatabase } from 'firebase/database';
import TOAUser from '@/lib/models/toa-user';
import { Event, EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import toast from 'react-hot-toast';
import localforage from 'localforage';
import {
  getMessaging,
  getToken as getMessagingToken,
  isSupported,
  onMessage
} from 'firebase/messaging';

const toaBaseUrl = 'https://api.theorangealliance.org';

const firebaseConfig = {
  apiKey: 'AIzaSyBi0Bn_WysaX9DSnpo-E5c-q0O6XBX7T_k',
  authDomain: 'auth.theorangealliance.org',
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
  return auth;
};

export const inStartupState = () => {
  return !app || !auth;
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

export const signUp = (email: string, name: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password).then(user => {
    sendEmailVerification(user.user);
    updateProfile(user.user, { displayName: name, photoURL: null });
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

export const addToFavorite = (key: string, type: 'event' | 'team'): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const body = { [type === 'event' ? 'event_key' : 'team_key']: key };

        fetch(toaBaseUrl + '/user/addFavorite', {
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

export const removeFromFavorite = (key: string, type: 'team' | 'event'): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const body = { [type === 'event' ? 'event_key' : 'team_key']: key };

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
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        fetch(toaBaseUrl + '/user/actions/updateEvent', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify([json])
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

export const addEventMedia = (mediaData: any): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          data: 'event'
        };

        fetch(toaBaseUrl + '/user/actions/addMedia', {
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

export const setNotifications = (
  type: 'team' | 'event',
  key: string,
  notify: boolean
): Promise<any> => {
  return new Promise<any[]>((resolve, reject) => {
    getToken()
      .then(token => {
        const headers = {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        fetch(toaBaseUrl + '/user/setNotifications', {
          headers,
          method: 'POST',
          body: JSON.stringify({ [type + '_key']: key, enabled: notify })
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

      fetch(toaBaseUrl + '/user/saveMessagingToken', {
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
        )
        .catch(reject);
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

      fetch(toaBaseUrl + '/user/removeMessagingToken', {
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
        )
        .catch(reject);
    });
  });
};

export const cloudMessaging = {
  isSupported: async (): Promise<boolean> => {
    return isSupported();
  },
  tokenInlocalforage: async (): Promise<string | null> => {
    return await localforage.getItem('fcm_token');
  },
  onMessage: async () => {
    isSupported().then(supported => {
      if (supported) {
        const messaging = getMessaging();
        onMessage(messaging, payload => {
          if (payload.notification?.title) toast(payload.notification.title);
        });
      }
    });
  },
  disable: async function () {
    try {
      const currToken: string | null = await this.tokenInlocalforage();
      if (currToken !== null && typeof currToken === 'string') {
        await removeMessagingToken(currToken);
      }
    } catch (err) {
      throw err;
    }
  },
  init: function () {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        // Get permission to send notifications
        const messaging = getMessaging(app);
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
          reject('Permission not granted');
        }

        // Check if we have a messaging token
        if ((await this.tokenInlocalforage()) !== null) {
          resolve(false);
        }

        // Get token
        await getMessagingToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID
        }).then(async currentToken => {
          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            await saveMessagingToken(currentToken);
            // save the token in your database
            localforage.setItem('fcm_token', currentToken);
            resolve(true);
          } else {
            throw new Error('No token found');
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};
