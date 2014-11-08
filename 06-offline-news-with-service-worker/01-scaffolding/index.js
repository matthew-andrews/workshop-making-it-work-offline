var port = Number(process.env.PORT || 8080);
var api = 'https://offline-news-api.herokuapp.com/stories';
var express = require('express');
var path = require('path');
require('es6-promise').polyfill();
require('isomorphic-fetch');
var templates = require('./public/templates');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/article/:guid', function(req, res) {
	fetch(api+'/'+req.params.guid)
		.then(function(response) {
			return response.json();
		})
		.then(function(article) {
			res.send(templates.article({
				title: article.title,
				body: article.body
			}));
		}, function(err) {
			res.status(404);
			res.send(templates.article({
				title: 'Story cannot be found',
				body: '<p>Please try another</p>'
			}));
		});
});

app.get('/', function(req, res) {
	fetch(api)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			res.send(templates.list(data));
		}, function(err) {
			res.status(404).end();
		});
});

app.listen(port);
console.log('listening on '+port);
