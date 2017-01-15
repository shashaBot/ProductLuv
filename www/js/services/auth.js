'use strict';

app.factory('Auth', function($state, facebookService){
  var auth = firebase.auth();
  var user = firebase.auth().currentUser;
  var FbToken;
  var Auth = {
    createProfile: function(uid, FbToken){
      var profile = {
        name: user.displayName,
        gender: facebookService.getUserData(FbToken).gender,
        email: user.email,
        avatar: user.photoUrl,
        birthday: facebookService.getUserData(FbToken).birthday,
        location: facebookService.getUserData(FbToken).location.name
      }
      console.log(profile);
      console.log(facebookService.getUserData(FbToken).birthday);
      return firebase.database().ref('/profiles/'+uid).set(profile);
    },
    getProfile: function(uid){
      return firebase.database().ref('/profiles/'+uid).once('value').then(snapshot){
        return snapshot.val();
      }
    }
    login: function(){
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('public_profile, email, user_location, user_birthday, user_photos, user_about_me');
      return auth.signInWithPopup(provider).then(function(result){
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        FbToken = result.credential.accessToken;
        // The signed-in user info.
        var user = Auth.getProfile(result.uid)
        // ...
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
})
