(function() {
	var cookie = 'up';
	var statuses = {
		"-1": 'timeout',
		"0": 'uncached',
		"1": 'idle',
		"2": 'checking',
		"3": 'downloading',
		"4": 'updateready',
		"5": 'obsolete'
	};

	// Start the AppCache loading process when this file executes
	load();

	function onMessage(event) {
		if (event.data && event.data.type && event.data.type === 'appcache:event') {
			onEvent.apply(window, event.data.args || []);
		}
	}

	function load() {
		window.addEventListener("message", onMessage, false);

		// HACK: Set a cookie so that the application
		// root returns a Javascript bootstrap rather
		// than content.
		var cookieExpires = new Date(new Date().getTime() + 60 * 5 * 1000);
		document.cookie = cookie + "=1;path=/;expires=" + cookieExpires.toGMTString();
		var iframe = document.createElement('IFRAME');
		iframe.setAttribute('style', 'width:0px; height:0px; visibility:hidden; position:absolute; border:none');
		iframe.setAttribute('src', '/iframe.html');
		iframe.setAttribute('id', 'appcache');
		document.body.appendChild(iframe);
	}

	function onEvent(eventCode) {
		var s = statuses[eventCode], loaderEl, cookieExpires;
		if (s === 'uncached' || s === 'idle' || s === 'obsolete' || s === 'timeout' || s === 'updateready') {
			loaderEl = document.getElementById('appcache');
			loaderEl.parentNode.removeChild(loaderEl);

			// Remove appcacheUpdate cookie
			cookieExpires = new Date(new Date().getTime() - 60 * 5 * 1000);
			document.cookie = cookie + "=;path=/;expires=" + cookieExpires.toGMTString();

			// Remove message listener
			window.removeEventListener("message", onMessage);
		}
	}
}());
