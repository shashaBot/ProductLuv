'use strict';

app.factory('Match', function($ionicPopup, $firebaseArray){
  var ref = firebase.database().ref();

  var Match = {
    allMatchesByUser: function(uid){
      return $firebaseArray(ref.child('matches').child(uid));
    },
    checkMatch: function(uid1, uid2){
      if(snap.val() != null){
        ref.child('matches').child(uid1).child(uid2).set(true);
        ref.child('matches').child(uid2).child(uid1).set(true);

        $ionicPopup.alert({
          title: 'Matched',
          template: 'Yay, you guys are matched'
        });
      }
    }
  }

  return Match;
})
