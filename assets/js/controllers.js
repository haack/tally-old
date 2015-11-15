'use strict';

var app = angular.module('tally');

app.controller('HomeController', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
	//init
	localStorage['poll'] = localStorage['poll'] || {}

	//CREATE A FIREBASE REFERENCE
	var ref = new Firebase("https://polll.firebaseio.com");

	// GET POLLS AS AN ARRAY
	$scope.polls = $firebaseArray(ref)

	$scope.polls.$loaded().then(function(list) {
		$scope.sortBy(list, 'popular');

	}).catch(function(error) {
		console.log("Error, Firebase data couldn't be pulled: ", error);
	});

	$scope.sortBy = function(list, order) {
		switch (order) {
			case 'popular':
				list.sort(function(a, b) {
					return a.yes+a.no < b.yes+b.no;
				});
				break;
		}
	}

	$scope.vote = function(id, answer) {
		var castVote = new Firebase("https://polll.firebaseio.com/"+id+'/'+answer);
		localStorage[id] = true;

		var buttonID = "[data-id='" + id + "']";

		if (answer === 'yes') {
			$(buttonID).find("button.btn-success").addClass("btn-full btn-border").prop('disabled', true);
			$(buttonID).find("button.btn-danger").addClass("btn-none");
			$(buttonID).find("button.btn-danger").fadeOut(600);
		}
		else {
			$(buttonID).find("button.btn-success").addClass("btn-none");
			$(buttonID).find("button.btn-danger").addClass("btn-full btn-border").prop('disabled', true);
			$(buttonID).find("button.btn-success").fadeOut(600);
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

			//TODO: fetch new id and scroll to

			console.log("Adding poll with question: " + $scope.newpoll.question);
		}

		//reset form
		$scope.newpoll = {};
	};
}]);
