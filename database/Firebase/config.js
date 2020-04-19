const firebase = require('firebase');

const initialize = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyBg8FhwkH7inmMcpdyar32TBMNSGYjrRIE",
        authDomain: "football-card.firebaseapp.com",
        databaseURL: "https://football-card.firebaseio.com",
        projectId: "football-card",
        storageBucket: "football-card.appspot.com",
        messagingSenderId: "198548854173",
        appId: "1:198548854173:web:7f0b494f57f1cf51e00b74",
        measurementId: "G-3CVLRS7RVD"
      };
    
      // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
    console.log("Firebase connected");
}

exports.initialize = initialize;