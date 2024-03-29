"use strict";

var app = angular.module('tally');

app.controller('HomeController', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
	//init
	localStorage['poll'] = localStorage['poll'] || {};
	var sortMode = 'popular' //set default sortMode

	//CREATE A FIREBASE REFERENCE
	var ref = new Firebase("https://polll.firebaseio.com/v1/");

	// GET POLLS AS AN ARRAY
	$scope.polls = $firebaseArray(ref);

	$scope.polls.$loaded().then(function(list) {
		$scope.sortBy(list, sortMode); //uses default sortMode

	}).catch(function(error) {
		console.log("Error, Firebase data couldn't be pulled: ", error);
	});

	$scope.sortBy = function(list, order) {
		$("li.active").removeClass("active");
		switch (order) {
			case 'popular':
				sortMode = 'popular';
				$("li.popular").addClass("active");
				list.sort(function(a, b) {
					return a.yes+a.no < b.yes+b.no ? 1 : -1;
				});
				break;
			case 'recent':
				sortMode = 'recent';
				$("li.recent").addClass("active");
				list.sort(function(a, b) {
					return a.dateadded < b.dateadded ? 1 : -1;
				});
				break;
		}
	};

	$scope.date = function(ms) {
		return Date(ms);
	}

	$scope.vote = function(id, answer) {
		if (!localStorage[id]) {
			var castVote = new Firebase("https://polll.firebaseio.com/v1/"+id+'/'+answer);
			localStorage[id] = answer;

			castVote.transaction(function(currentVoteCount) {
				return currentVoteCount + 1;
			});
		}
	};

	$scope.addPoll = function() {
		if ($scope.newpoll.question) {
			var pollsref = new Firebase('https://polll.firebaseio.com/v1/');

			pollsref.push({
				'question': $scope.newpoll.question,
				'yes': 0,
				'no': 0,
				'dateadded': Date.now()
			// }, function() {
				//re-sort feed (disabled as it doesn't reorder including first poll, wtf....)
				// $scope.sortBy($scope.polls, sortMode); //sort with current mode
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
