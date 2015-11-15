"use strict";

var app = angular.module('tally');

app.controller('HomeController', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
	//init
	localStorage['poll'] = localStorage['poll'] || {};

	//CREATE A FIREBASE REFERENCE
	var ref = new Firebase("https://polll.firebaseio.com");

	// GET POLLS AS AN ARRAY
	$scope.polls = $firebaseArray(ref);

	$scope.polls.$loaded().then(function(list) {
		$scope.sortBy(list, 'recent');

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
			case 'recent':
				list.sort(function(a, b) {
					return a.dateadded < b.dateadded;
				});
				break;
		}
	};

	$scope.date = function(ms) {
		return Date(ms);
	}

	$scope.vote = function(id, answer) {
		if (!localStorage[id]) {
			var castVote = new Firebase("https://polll.firebaseio.com/"+id+'/'+answer);
			localStorage[id] = answer;

			var buttonID = "[data-id='" + id + "']";

			if (answer === 'yes') {
				$(buttonID).find("button.btn-success").addClass("btn-full");
				$(buttonID).find("button.btn-danger").addClass("btn-none").prop('disabled', true);
				//$(buttonID).find("button.btn-danger").fadeOut(600);
			}
			else {
				$(buttonID).find("button.btn-success").addClass("btn-none").prop('disabled', true);
				$(buttonID).find("button.btn-danger").addClass("btn-full");
				//$(buttonID).find("button.btn-success").fadeOut(600);
			}

			castVote.transaction(function(currentVoteCount) {
				return currentVoteCount + 1;
			});
		}
	};

	$scope.addPoll = function() {
		console.log("Here");
		if ($scope.newpoll.question) {
			var pollsref = new Firebase('https://polll.firebaseio.com/');

			pollsref.push({
				'question': $scope.newpoll.question,
				'yes': 0,
				'no': 0,
				'dateadded': Date.now()
			});

			//TODO: fetch new id and scroll to

			console.log("Adding poll with question: " + $scope.newpoll.question);
		}

		//reset form
		$scope.newpoll = {};
	};

	$scope.isVoted = function(questionId) {
		if (typeof(localStorage[questionId]) !== "undefined" && localStorage[questionId] !== null) {
			return true;
		}
		else {
			return false;
		}
	};

	$scope.isOptionVisible = function(questionId, answer) {
		if ($scope.isVoted(questionId)) {
			return localStorage[questionId] === answer ? true : false;
		}
		else {
			return true;
		}
	};
}]);
