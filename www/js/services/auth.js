'use strict';

app.factory('Auth', function($state, $firebaseAuth, $q, $http, $rootScope){
  var auth = firebase.auth();
  var ref = firebase.database().ref();
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
        var accessToken = result.credential.accessToken;
        // The signed-in user info.
        console.log(result.user);
        Auth.getProfile(result.user.uid).then(function(profile){
          if(profile.name == undefined){
            var genderPromise = $http.get('https://graph.facebook.com/me?fields=gender&access_token=' + accessToken);
            var birthdayPromise = $http.get('https://graph.facebook.com/me?fields=birthday&access_token=' + accessToken);
            var locationPromise = $http.get('https://graph.facebook.com/me?fields=location&access_token=' + accessToken);
            var bioPromise = $http.get('https://graph.facebook.com/me?fields=about&access_token=' + accessToken);
            var imagesPromise = $http.get('https://graph.facebook.com/me/photos/uploaded?fields=source&access_token=' + accessToken);
            var promises = [genderPromise, birthdayPromise, locationPromise, bioPromise, imagesPromise];
            $q.all(promises).then(function(data){
              var info = result.user.providerData[0];
              var profile = {
                name: info.displayName,
                email: info.email,
                avatar: info.photoURL,
                gender: data[0].data.gender ? data[0].data.gender : "",
                 birthday: data[1].data.birthday ? data[1].data.birthday : "",
                 age: data[1].data.birthday ? Auth.getAge(data[1].data.birthday) : "",
                 location: data[2].data.location ?  data[2].data.location.name : "",
                 bio: data[3].data.about ? data[3].data.about : "",
                 images: data[4].data.data
              }
              Auth.createProfile(result.user.uid, profile);
            });
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
    },
    getAge: function(birthday) {
      return new Date().getFullYear() - new Date(birthday).getFullYear();
    },

    requireAuth: function() {
      return auth.currentUser;
    }
  };

  auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      $rootScope.signedInUser = user;
      console.log('logged in!');
    } else {
      // No user is signed in.
      $rootScope.signedInUser = null;
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
