'use strict';

app.controller('AuthCtrl', function(Auth, $state) {

	var auth = this;

	auth.login = function() {
		console.log('Login clicked');

		Auth.login().then(function(user) {
			$state.go('app.home');
		});

	};

	auth.logout = function() {
		Auth.logout();
	};
});
