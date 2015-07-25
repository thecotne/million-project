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
			}
			else {
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
	var params = [
		`__a=1`,
		`fb_dtsg=${opts.dtsg}`,
		`group_id=${opts.gid}`,
		`source=typeahead`,
		`ref=`,
		`message_id=`,
		`members=${opts.friend.uid}`,
		`__user=${opts.uid}`,
		`phstamp=`
	];

	var paramsString = params.join('&');

	xhr.open("POST", "/ajax/groups/members/add_post.php", true),
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
	xhr.onreadystatechange = () => {
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

	get(`/ajax/typeahead/first_degree.php?__a=1&viewer=${uid}&token=${Math.random()}&filter[0]=user&options[0]=friends_only`)
	.then(response =>  {
		var data = JSON.parse( response.substr(9) );
		var friends;

		if (data.payload && data.payload.entries) {
			var friends = data.payload.entries.sort(() => .5 - Math.random());
		};

		for (let friend of friends) {
			addFriend({ dtsg, uid, gid, friend });
		}
	}).catch(error => {
		console.log("Failed!", error);
		// debugger;
	});
}

addFriends();

