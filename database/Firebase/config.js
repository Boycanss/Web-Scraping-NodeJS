const firebase = require('firebase');

const initialize = () => {
    const firebaseConfig = {
        apiKey: "",
        authDomain: "football-card.firebaseapp.com",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
      };
    
      // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
    console.log("Firebase connected");
}

exports.initialize = initialize;
