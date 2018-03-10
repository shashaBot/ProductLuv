'use strict';

app.controller('HomeCtrl', function(Auth, $ionicLoading, $ionicModal, $scope, Like, Match, uid) {

	var home = this;
	home.currentCardUid = null;

	var cat = null;
	var stat = null;
	var currentUid = uid;

	$scope.show = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="bubbles"></ion-spinner>'
		});
	};

	$scope.hide = function() {
		$ionicLoading.hide();
	}

	function init() {

		$scope.show();

		home.products = [];
		var catObj = JSON.parse(window.localStorage.getItem('cat'));
		if(catObj && catObj!=="blah"){
			cat = catObj;
		}
		else{
			cat = "";
		}

		var statObj = JSON.parse(window.localStorage.getItem('stat'));

		if(statObj && statObj !=="blah"){
			stat = statObj;
		}
		else{
			stat = "";
		}

		Auth.getProducts().$loaded().then(function(data) { //if no category is specified, all should be listed
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				home.products.push(item);
			}
			Like.allLikesByUser(currentUid).$loaded().then(function(likesList) {
				home.products = _.filter(home.products, function(obj) {
					return _.isEmpty(_.where(likesList, {$id: obj.$id}));
				});
			});

			$scope.hide();
		});
	}

	$scope.$on('$ionicView.enter', function(e) {
		init();
	});

	home.nope = function(index) {
		// home.cardRemoved(index);
		console.log('NOPE');
	};

	home.like = function(like_uid) {
		Like.addLike(currentUid, like_uid);
		// Match.checkMatch(currentUid, like_uid);

		// home.cardRemoved(index);
		console.log('LIKE');
	};

	// home.cardRemoved = function(index) {
	// 	home.profiles.splice(index, 1);
	//
	// 	if (home.profiles.length > 0) {
	// 		home.currentIndex = home.profiles.length - 1;
	// 		home.currentCardUid = home.profiles[home.currentIndex].$id;
	// 	}
	// };

});
