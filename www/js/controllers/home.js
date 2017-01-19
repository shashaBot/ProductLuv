'use strict';

app.controller('HomeCtrl', function(Auth) {
  var home = this;
  home.profiles = Auth.getProfiles();
  console.log(home.profiles);
});
