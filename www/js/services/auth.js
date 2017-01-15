'use strict';

app.factory('Auth', function($state, $firebaseObject){
  var auth = firebase.auth();
  var ref = firebase.database().ref();
  var FbToken;
  var Auth = {
    createProfile: function(uid, profile){
      return firebase.database().ref('/profiles/'+uid).set(profile);

    },
    getProfile: function(uid){
      return firebase.database().ref('/profiles/'+uid).once('value');
    },
    login: function(){
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('public_profile, email, user_location, user_birthday, user_photos, user_about_me');
      return auth.signInWithPopup(provider).then(function(result){
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        FbToken = result.credential.accessToken;
        // The signed-in user info.
        console.log(result.user);
        Auth.getProfile(result.user.uid).then(function(profile){
          if(profile.name == undefined){
            console.log('profile name undefined');
            var info = result.user.providerData[0];
            var profile = {
              name: info.displayName,
              email: info.email,
              avatar: info.photoURL
            }
            Auth.createProfile(result.user.uid, profile);
          }
        });
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    },
    logout: function(){
      return auth.signOut().then(function() {
        // Sign-out successful.
      }, function(error) {
        // An error happened.
      });
    }
  };

  auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log('logged in!');
    } else {
      // No user is signed in.
      $state.go('login');
      console.log('You need to login!');
    }
  });


  return Auth;
});


// 'use strict';
//
// app.factory('Auth', function($firebaseAuth, $firebaseObject, $state) {
//     var ref = firebase.database().ref();
//     var auth = $firebaseAuth();
//
//     var Auth = {
//
//         createProfile: function(uid, profile) {
//             return ref.child('profiles').child(uid).set(profile);
//         },
//
//         getProfile: function(uid) {
//             return $firebaseObject(ref.child('profiles').child(uid));
//         },
//
//         login: function() {
//             var provider = new firebase.auth.FacebookAuthProvider();
//             provider.addScope('public_profile, email, user_location, user_birthday, user_photos, user_about_me');
//
//             return auth.$signInWithPopup(provider)
//
//                 .then(function(result) {
//                     var accessToken = result.credential.accessToken;
//                     var user = Auth.getProfile(result.user.uid).$loaded();
//
//                     user.then(function(profile) {
//                         if (profile.name == undefined) {
//
//                             var info = result.user.providerData[0];
//                             var profile = {
//                                 name: info.displayName,
//                                 email: info.email,
//                                 avatar: info.photoURL,
//                             }
//                             Auth.createProfile(result.user.uid, profile);
//                         }
//                     });
//                 });
//         },
//
//         logout: function() {
//             return auth.$signOut();
//         }
//
//     };
//
//     auth.$onAuthStateChanged(function(authData) {
//         if(authData) {
//             console.log('Logged in!');
//         } else {
//             $state.go('login');
//             console.log('You need to login.');
//         }
//     });
//
//     return Auth;
//
// });
