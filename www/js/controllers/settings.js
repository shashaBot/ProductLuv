'use strict';

app.controller('SettingCtrl', function(Auth, $ionicPopup){
  var sett = this;

  sett.stat = JSON.parse(window.localStorage.getItem('stat'));
  sett.stat = sett.stat == null ? "": sett.stat;
  sett.cat = JSON.parse(window.localStorage.getItem('cat'));
  sett.cat = sett.cat == null ? "": sett.cat;


  sett.setStat = function(){
    if(sett.stat && sett.stat!=="blah"){
      window.localStorage.setItem('stat', JSON.stringify(sett.stat));
    }
    else {
      window.localStorage.setItem('stat',JSON.stringify("blah"));
    }
  };

  sett.setCat = function(){
    if(sett.cat && sett.cat!=="blah"){
      window.localStorage.setItem('cat', JSON.stringify(sett.cat));
    }
    else {
      window.localStorage.setItem('cat', JSON.stringify("blah"));
    }
  };

  sett.logout = function(){
    $ionicPopup.confirm({
      title: 'Logout',
      template: 'Do you want to logout?'
    }).then(function(res){
      if(res){
        Auth.logout();
      }
    });
  };
});
