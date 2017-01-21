'use strict';

app.controller('MatchCtrl', function(Match, Like, Auth, uid, $scope){
 var matc = this;

 function init(){

   matc.list = [];

   Match.allMatchesByUser(uid).$loaded().then(function(data){
     for(var i = 0; i < data.length; i++){
       var item = data[i];

       Auth.getProfile(item.$id).$loaded().then(function(profile) {
         matc.list.push(profile);
       });
     }
   });
 }

 $scope.$on('$ionicView.enter', function(e){
   init();
 });

 matc.unmatch = function(matchUid){
   Like.removeLike(uid, matchUid);
   Match.removeMatch(uid, matchUid);
   init();
 };


});
