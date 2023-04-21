importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyBi0Bn_WysaX9DSnpo-E5c-q0O6XBX7T_k',
  authDomain: 'auth.theorangealliance.org',
  databaseURL: 'https://the-orange-alliance.firebaseio.com',
  projectId: 'the-orange-alliance',
  storageBucket: 'the-orange-alliance.appspot.com',
  messagingSenderId: '495169296462',
  appId: '1:495169296462:web:a8543d9517ea3cea4e0b1f'
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/imgs/icon512.png',
    data: {
      url: payload.data.url
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  let url = event.notification.data.url;
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
