importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: 'AIzaSyBi0Bn_WysaX9DSnpo-E5c-q0O6XBX7T_k',
    authDomain: 'the-orange-alliance.firebaseapp.com',
    databaseURL: 'https://the-orange-alliance.firebaseio.com',
    projectId: 'the-orange-alliance',
    storageBucket: 'the-orange-alliance.appspot.com',
    messagingSenderId: '495169296462',
    appId: '1:495169296462:web:a8543d9517ea3cea4e0b1f'
};

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();



messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});