'use strict';

var app = angular.module('tally');

app.controller('HomeController', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
	//init
	localStorage['poll'] = localStorage['poll'] || {}

	//CREATE A FIREBASE REFERENCE
	var ref = new Firebase("https://polll.firebaseio.com");

	// GET MESSAGES AS AN ARRAY
	$scope.polls = $firebaseArray(ref);

	console.log("Polls:", $scope.polls);

	$scope.vote = function(id, answer) {
		var castVote = new Firebase("https://polll.firebaseio.com/"+id+'/'+answer);
		localStorage[id] = true;

		castVote.transaction(function(currentVoteCount) {
			return currentVoteCount + 1;
		});
	};


	// //ADD MESSAGE METHOD
	// $scope.addMessage = function(e) {
	// 	//LISTEN FOR RETURN KEY
	// 	if (e.keyCode === 13 && $scope.msg) {
	// 	  //ALLOW CUSTOM OR ANONYMOUS USER NAMES
	// 	  var name = $scope.name || "anonymous";
	// 	  //ADD TO FIREBASE
	// 	  $scope.messages.$add({
	// 	    from: name,
	// 	    body: $scope.msg
	// 	  });
	// 	  //RESET MESSAGE
	// 	  $scope.msg = "";
	// 	}
	// }
}]);