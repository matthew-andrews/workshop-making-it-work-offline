var api = 'https://offline-news-api.herokuapp.com/stories';
var port = 8080;
var express = require('express');
var path = require('path');
var request = require('superagent');
var templates = require('./public/templates');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/article/:guid', function(req, res) {
	request.get(api+'/'+req.params.guid)
		.end(function(err, data) {
			var article = data.body;
			if (err || !data.ok) {
				res.status(404);
				res.send(templates.article({
					title: "Story cannot be found",
					body: "<p>Please try another</p>"
				}));
			} else {
				res.send(templates.article({
					title: article.title,
					body: article.body
				}));
			}
		});
});

app.get('/', function(req, res) {
	request.get(api)
		.end(function(err, data) {
			if (err) {
				res.status(404).end();
			} else {
				res.send(templates.list(data.body));
			}
		});
});

app.listen(port);
console.log('listening on '+port);
