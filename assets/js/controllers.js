'use strict';

var app = angular.module('tally');

app.controller('HomeController', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
	//init
	localStorage['poll'] = localStorage['poll'] || {}

	//CREATE A FIREBASE REFERENCE
	var ref = new Firebase("https://polll.firebaseio.com");

	// GET POLLS AS AN ARRAY
	$scope.polls = $firebaseArray(ref);

	console.log("Polls:", $scope.polls);

	$scope.vote = function(id, answer) {
		var castVote = new Firebase("https://polll.firebaseio.com/"+id+'/'+answer);
		localStorage[id] = true;

		var buttonID = "[data-id='" + id + "']";

		if (answer === 'yes') {
			$(buttonID).find("button.btn-success").addClass("btn-full").prop('disabled', true);
			$(buttonID).find("button.btn-danger").addClass("btn-none");
			$(buttonID).find("button.btn-danger").fadeOut(700);
		}
		else {
			$(buttonID).find("button.btn-success").addClass("btn-none");
			$(buttonID).find("button.btn-danger").addClass("btn-full").prop('disabled', true);
			$(buttonID).find("button.btn-success").fadeOut(700);
		}

		castVote.transaction(function(currentVoteCount) {
			return currentVoteCount + 1;
		});
	};

	$scope.addPoll = function() {
		if ($scope.newpoll.question) {
			var pollsref = new Firebase('https://polll.firebaseio.com/');

			pollsref.push({
				'question': $scope.newpoll.question, 
				'yes': 0, 
				'no': 0
			});

			console.log("Adding poll with question: " + $scope.newpoll.question);
		}
		//reset form
		$scope.newpoll = {};
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
