'use strict';

app.controller('HomeCtrl', function(Auth, $ionicLoading, $scope, Like, uid, Match) {
  var home = this;
  var maxAge = null;
  var men = null;
  var women = null;
  home.currentIndex = null;

  var currentUid = uid;
  $scope.show = function(){
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };

  function init(){
    $scope.show();
    home.profiles = [];
    maxAge = JSON.parse(window.localStorage.getItem('maxAge')) || 25;

    men = JSON.parse(window.localStorage.getItem('men'));
    women = JSON.parse(window.localStorage.getItem('women'));

    men= men==null? true: men;
    women = women==null? true: women;

    Auth.getProfilesByAge(maxAge).$loaded().then(function(data){
      for(var i=0; i<data.length; i++){
        var item = data[i];

        if((item.gender == 'male' && men) || (item.gender == 'female' && women)){
          if(item.$id != currentUid){
            home.profiles.push(item);
          }
        }
      }

      Like.allLikesByUser(currentUid).$loaded().then(function(likesList){
        home.profiles = _.filter(home.profiles, function(obj){
          return _.isEmpty(_.where(likesList, {$id: obj.$id}));
        });
      });

      if(home.profiles.length > 0){
        home.currentIndex = home.profiles.length -1;
      }
    });

    $scope.hide();
  }
  $scope.$on('$ionicView.enter', function(e){
    init();
  });

  home.nope = function(index){
    home.cardRemoved(index);
    console.log('nope');
  };

  home.like = function(index, like_uid){
    Like.addLike(currentUid, like_uid);
    Match.checkMatch(currentUid, like_uid);
    home.cardRemoved(index);
    console.log('like');
  };

  home.cardRemoved = function(index){
    home.profiles.splice(index, 1);
    if(home.profiles.length > 0){
      home.currentIndex = home.profiles.length -1;
    }
  }
});
