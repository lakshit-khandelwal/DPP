// const express = require('express');
// const app = express();
// const port = 3000;
// const db = require('./db');
// const routes = require('./routes'); // Import your routes file
// const firebase = require('firebase/app');
// require('firebase/auth');

// // Initialize Firebase (as shown in Step 1)
// const firebaseConfig = {
//   apiKey: 'AIzaSyDrjlbAVJ_yPpORBk5793AYuFENp6mIkFk',
//   authDomain: 'dpp-project-938e7.firebaseapp.com',
//   projectId: 'dpp-project-938e7',
//   storageBucket: 'gs://dpp-project-938e7.appspot.com',
//   messagingSenderId: '305893390847',
//   appId: '1:305893390847:android:9965ec86958c735a1e4fca'
// };

// firebase.initializeApp(firebaseConfig);

// // Middleware to check if the user is authenticated
// const isAuthenticated = (req, res, next) => {
//   const user = firebase.auth().currentUser;
//   if (user) {
//     req.user = user;
//     next();
//   } else {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// // Firebase Google Sign-In
// app.get('/api/auth/google', (req, res) => {
//   const provider = new firebase.auth.GoogleAuthProvider();

//   firebase.auth().signInWithPopup(provider)
//     .then((result) => {
//       const user = result.user;
//       res.json({ user });
//     })
//     .catch((error) => {
//       res.status(500).json({ error: error.message });
//     });
// });

// // Use the isAuthenticated middleware for protected routes
// app.use('/api', isAuthenticated, routes);

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });





const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');
const routes = require('./src/route/routes');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK for server-side tasks
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dpp-project-938e7.firebaseio.com', // Replace with your Firebase project ID
});

// Middleware to check if the user is authenticated using Firebase Admin SDK
const isAuthenticated = async (req, res, next) => {
  try {
    // const decodedIdToken = await admin.auth().verifyIdToken(req.headers.authorization);
    // req.user = decodedIdToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Firebase Google Sign-In
app.get('/api/auth/google', async (req, res) => {
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(req.headers.authorization);
    const user = decodedIdToken;
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use the isAuthenticated middleware for protected routes4
app.use(bodyParser.json());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
