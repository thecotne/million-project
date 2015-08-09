function queryString(data) {
	var arr = [];
	for(let key in data) {
		arr.push(`${key}=${data[key]}`);
	}
	return arr.join('&');
}

function addFriend({dtsg, gid, friend, uid}) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/ajax/groups/members/add_post.php", true),
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var data = JSON.parse(xhr.responseText.substr(9));
			console.log(data);
		}
	};
	xhr.send(queryString({
		'__a': 1,
		'fb_dtsg': dtsg,
		'group_id': gid,
		'source': 'typeahead',
		'ref': '',
		'message_id': '',
		'members': friend.uid,
		'__user': uid,
		'phstamp': '',
	}));
}

function addFriends({dtsg, uid, gid}) {
	var params = queryString({
		'__a': 1,
		'viewer': uid,
		'token': Math.random(),
		'filter[0]': 'user',
		'options[0]': 'friends_only',
	});
	var xhr = new XMLHttpRequest();
	xhr.open('GET', `/ajax/typeahead/first_degree.php?${params}`);
	xhr.onload = () => {
		if (xhr.status == 200) {
			var data = JSON.parse( xhr.response.substr(9) );
			if (data.payload && data.payload.entries) {
				var friends = data.payload.entries.sort(() => .5 - Math.random());
				for (let friend of friends) {
					addFriend({ dtsg, uid, gid, friend });
				}
			};
		}
	};
	xhr.send();
}

function joinCurrentGroup() {
	document.querySelector('#fbProfileCover [ajaxify]').click();
}

function addPeopleInCurrentGroup() {
	addFriends({
		dtsg: document.querySelector('[name=fb_dtsg]').value,
		uid: document.cookie.match(/c_user=(\d+)/)[1],
		gid: document.querySelector('[name=group_id]').value,
	});
}

// https://www.facebook.com/groups/785323994921883/requests/
function approveAllInCurrentGroup() {
	document.querySelector('#pagelet_group_requests [ajaxify*=confirm_bulk_action]:not([ajaxify*=ignore])').click();

	var watcher = setInterval(() => {
		var layerConfirm = document.querySelector('.layerConfirm');
		if (layerConfirm) {
			clearInterval(watcher);
			layerConfirm.click();
		};
	}, 50);

}

function onNotificationChange() {
	document.getElementById('notificationsCountValue')
	.addEventListener('DOMNodeInserted', e => {
		document.querySelector('#groupsUnifiedQueue [ajaxify*="groups/unified_queue/async_response/?queue=requests&groupid"]').click();
		var watcher = setInterval(() => {
			if (document.querySelector('#pagelet_group_requests [ajaxify*=confirm_bulk_action]:not([ajaxify*=ignore])')) {
				clearInterval(watcher);
				approveAllInCurrentGroup();
			};
		}, 50);
	});
}
