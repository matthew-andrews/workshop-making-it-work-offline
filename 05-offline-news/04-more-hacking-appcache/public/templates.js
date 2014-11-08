(function() {
	var exports = {
		list: list,
		article: article
	};

	function list(data) {
		data = data || [];
		var ul = '';
		data.forEach(function(story) {
			ul += '<li><a class="js-link" href="/article/'+story.guid+'">'+story.title+'</a></li>';
		});
		return '<h1>FT Tech Blog</h1><ul>'+ul+'</ul>';
	}

	function article(data) {
		return '<nav><a class="js-link" href="/">&raquo; Back to FT Tech Blog</a></nav><h1>'+data.title+'</h1>'+data.body;
	}

	if (typeof module == 'object') {
		module.exports = exports;
	} else {
		window.templates = exports;
	}
}());
