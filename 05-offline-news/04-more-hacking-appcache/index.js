require('es6-promise').polyfill();
require('isomorphic-fetch');

var api = 'https://offline-news-api.herokuapp.com/stories';
var port = 8080;

var cookieParser = require('cookie-parser');
var express = require('express');
var path = require('path');
var templates = require('./public/templates');

var app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
		+ '\n    <main>'+data.main+'</main>'
		+ '\n    <script src="/indexeddb.shim.min.js"></script>'
		+ '\n    <script src="/fetch.js"></script>'
		+ '\n    <script src="/promise.js"></script>'
		+ '\n    <script src="/templates.js"></script>'
		+ '\n    <script src="/appcache.js"></script>'
		+ '\n    <script src="/application.js"></script>'
		+ '\n  </body>'
		+ '\n</html>';
}

app.listen(port);
console.log('listening on port', port);
