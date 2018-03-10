'use strict';

app.factory('Auth', function($firebaseAuth, $firebaseObject, $firebaseArray, $state, $http, $q) {
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    var Auth = {

        createProfile: function(uid, profile) {
            return ref.child('profiles').child(uid).set(profile);
        },

        getProfile: function(uid) {
            return $firebaseObject(ref.child('profiles').child(uid));
        },
        getProduct: function(productId) {
          return $firebaseObject(ref.child('products').child(productId));
        },
        addProduct: function(product){
          var newProductKey = ref.child('products').push().key;
          return ref.child('products').child(newProductKey).set(product);
        },
        login: function() {
            var provider = new firebase.auth.GoogleAuthProvider();

            return auth.$signInWithPopup(provider)
                .then(function(result) {
                    var accessToken = result.credential.accessToken;
                    var user = Auth.getProfile(result.user.uid).$loaded();
                    console.log(user);
                    user.then(function(profile) {
                        if (profile.name == undefined) {
                            var info = result.user.providerData[0];
                            var profile = {
                                name: info.displayName,
                                email: info.email,
                                avatar: info.photoURL,
                            }
                            Auth.createProfile(result.user.uid, profile);
                        }
                    });
                });
        },

        logout: function() {
            ref.child('products').child(auth.$getAuth().uid).update({isOnline: false});
            return auth.$signOut();
        },

        requireAuth: function() {
            return auth.$requireSignIn();
        },
        getProducts: function(){
          return $firebaseArray(ref.child('products'));
        },
        getProductsByUser: function(userId) {
          return $firebaseArray(ref.child('products').orderByChild('creatorId').equalTo(userId));
        },
        getProductsByCat: function(category){
          if(category){
            return $firebaseArray(ref.child('products').orderByChild('productCat').equalTo(category));
          }
          else{
            return $firebaseArray(ref.child('products'));
          }
        },
        setOnline: function(uid){
          var connected = $firebaseObject(ref.child(".info/connected"));
          var online = $firebaseObject(ref.child('profiles').child(uid));

          connected.$watch(function(){
              if(connected.$value === true){
                  ref.child('profiles').child(uid).update({
                      isOnline: true
                  });

                  online.$ref().onDisconnect().update({
                      isOnline: false
                  });
              }
          });
        }

    };

    auth.$onAuthStateChanged(function(authData) {
        if(authData) {
            console.log('Logged in!');
        } else {
            $state.go('login');
            console.log('You need to login.');
        }
    });

    return Auth;

});
