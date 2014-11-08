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
			if (err || !data.ok) {
				res.status(404);
				res.send(layoutShell({
					main: templates.article({
						title: 'Story cannot be found',
						body: '<p>Please try another</p>'
					})
				}));
			} else {
				res.send(layoutShell({
					main: templates.article(data.body)
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
				res.send(layoutShell({
					main: templates.list(data.body)
				}));
			}
		});
});

function layoutShell(data) {
	data = {
		title: data && data.title || 'FT Tech News',
		main: data && data.main || ''
	};
	return '<!DOCTYPE html>'
		+ '\n<html>'
		+ '\n	<head>'
		+ '\n		<title>'+data.title+'</title>'
		+ '\n		<link rel="stylesheet" href="/styles.css" type="text/css" media="all" />'
		+ '\n	</head>'
		+ '\n	<body>'
		+ '\n		<main>'+data.main+'</main>'
		+ '\n	</body>'
		+ '\n</html>';
}

app.listen(port);
console.log('listening on port', port);
