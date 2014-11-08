# Scaffolding

This assumes familiarity with [*npm*](https://www.npmjs.org/), `package.json` and [*express*](http://expressjs.com/).

## Set up a quick *Express* server

In a new folder, create some files and a directory:-

- [`/public`](./public) - a new directory
- [`/public/styles.css`](./public/style.css) - some simple styles
- [`/public/templates.js`](./public/templates.js) - templating functions that will be shared between the server and the client
- [`/index.js`](./index.js) - this will be our express server
- [`/package.json`](./package.json) - this will be for listing our dependencies, initially all this will need to contain is `{}`.


```
echo '{}' >> test.json # Neat trick if you're using *nix
npm install --save express cookie-parser es6-promise isomorphic-fetch
```

## Online only

To begin with we'll make the application work online only (ie. a normal website) and then discuss the changes that we will have to make to make it work offline.  As building normal websites is an assumed prerequisite of this course heavy use of copy-paste is encouragedhere unless anything is unclear:

##### [`public/styles.css`](./public/styles.css)

```css
body {
	margin: 0;
	padding: 0;
	font-family: helvetica, sans-serif;
}
* {
	box-sizing: border-box;
}
h1 {
	padding: 14px 0 14px 0;
	margin: 0;
	font-size: 44px;
	border-bottom: solid 1px #DDD;
	line-height: 1em;
}
nav {
	padding: 14px 0 14px 0;
}
main {
	padding: 0 14px;
}
ul {
	padding: 0;
	margin: 0;
	list-style: none;
}
li {
	padding: 20px 0 20px 0;
	border-bottom: solid 1px #DDD;
}
```

Nothing too surprising should jump out here - it's just plain CSS.

##### [`public/templates.js`](./public/templates.js)

```js
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
```

As we discussed above, these functions will eventually be used on the client side - which is why they need to go inside `public`.

`list` and `article` are functions that take a JavaScript object containing data that represent a list of stories and a single story, respectively.

The last few lines are potentially a little confusing:-

```js
if (typeof module == 'object') {
	module.exports = exports;
} else {
	window.templates = exports;
}
```

`if (typeof module == 'object')` is just a way of saying "am I running on the server" - and if that is the case this module will expose its functions via `module.exports`, otherwise it will add them to the `window` object.

##### [`index.js`](./index.js)

```js
require('es6-promise').polyfill();
require('isomorphic-fetch');

var port = Number(process.env.PORT || 8080);
var api = 'https://offline-news-api.herokuapp.com/stories';

var cookieParser = require('cookie-parser');
var express = require('express');
var path = require('path');
var templates = require('./public/templates');

var app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Manifest returns a 400 unless the AppCache cookie is set
app.get('/offline.appcache', function(req, res) {
	if (req.cookies.up) {
		res.set('Content-Type', 'text/cache-manifest');
		res.send('CACHE MANIFEST'
			+ '\n./appcache.js'
			+ '\n./application.js'
			+ '\n./iframe.js'
			+ '\n./indexeddb.shim.min.js'
			+ '\n./promise.js'
			+ '\n./styles.css'
			+ '\n./fetch.js'
			+ '\n./templates.js'
			+ '\n'
			+ '\nFALLBACK:'
			+ '\n/ /'
			+ '\n'
			+ '\nNETWORK:'
			+ '\n*');
	} else {
		res.status(400).end();
	}
});

// Add middleware to send this when the appcache update cookie is set
app.get('/', offlineMiddleware);
app.get('/article/:guid', offlineMiddleware);

function offlineMiddleware(req, res, next) {
	if (req.cookies.up) res.send(layoutShell());
	else next();
}

app.get('/fallback.html', function(req, res) {
	res.send(layoutShell());
});

app.get('/article/:guid', function(req, res) {
	fetch(api+'/'+req.params.guid)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			res.send(layoutShell({
				main: templates.article(data)
			}));
		}, function(err) {
			res.status(404);
			res.send(layoutShell({
				main: templates.article({
					title: 'Story cannot be found',
					body: '<p>Please try another</p>'
				})
			}));
		});
});

app.get('/', function(req, res) {
	fetch(api)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			res.send(layoutShell({
				main: templates.list(data)
			}));
		}, function(err) {
			res.status(404).end();
		});
});

function layoutShell(data) {
	data = {
		title: data && data.title || 'FT Tech News',
		main: data && data.main || ''
	};
	return '<!DOCTYPE html>'
		+ '\n<html>'
		+ '\n  <head>'
		+ '\n    <title>'+data.title+'</title>'
		+ '\n    <link rel="stylesheet" href="/styles.css" type="text/css" media="all" />'
		+ '\n  </head>'
		+ '\n  <body>'
		+ '\n    <div class="brandrews"><a href="https://mattandre.ws">mattandre.ws</a> | <a href="https://twitter.com/andrewsmatt">@andrewsmatt</a></div>'
		+ '\n    <main>'+data.main+'</main>'
		+ '\n    <script src="/indexeddb.shim.min.js"></script>'
		+ '\n    <script src="/fetch.js"></script>'
		+ '\n    <script src="/promise.js"></script>'
		+ '\n    <script src="/templates.js"></script>'
		+ '\n    <script src="/appcache.js"></script>'
		+ '\n    <script>'
		+ '\n      (function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){'
		+ '\n      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),'
		+ '\n      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)'
		+ '\n      })(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');'
		+ '\n      ga(\'create\', \'UA-34192510-7\', \'auto\');'
		+ '\n      ga(\'send\', \'pageview\');'
		+ '\n    </script>'
		+ '\n    <script src="/application.js"></script>'
		+ '\n  </body>'
		+ '\n</html>';
}

app.listen(port);
console.log('listening on '+port);
```

Now run the application in your favourite web browser and check that both views work by running:-

```js
node index.js
```

And opening `http://localhost:8080` with your favourite browser.

---

[← Back to *building and offline news app, FT style*](../) | [Continue to *single/multi-page app* →](../02-single-multi-page)
