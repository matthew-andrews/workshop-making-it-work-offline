# Scaffolding

This assumes familiarity with *npm*, `package.json` and [*express*](http://expressjs.com/).

## Set up a quick *express* server

In a new folder, create some files and a directory:-

- `/public` - a new directory
- `/public/styles.css` - some simple styles
- `/public/templates.js` - templating functions that will be shared between the server and the client
- `/index.js` - this will be our express server
- `/package.json` - this will be for listing our dependencies, initially all this will need to contain is `{}`.


```
echo '{}' >> test.json # Neat trick if you're using *nix
npm install --save express cookie-parser superagent
```

## Online only

To begin with we'll make the application work online only (ie. a normal website) and then discuss the changes that we will have to make to make it work offline.  As building normal websites is an assumed prerequisite of this course heavy use of copy-paste is encouragedhere unless anything is unclear:

#### `public/styles.css`

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

#### `public/templates.js`

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

#### `index.js`

```js
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
    + '\n  <head>'
    + '\n    <title>'+data.title+'</title>'
    + '\n    <link rel="stylesheet" href="/styles.css" type="text/css" media="all" />'
    + '\n  </head>'
    + '\n  <body>'
    + '\n    <main>'+data.main+'</main>'
    + '\n  </body>'
    + '\n</html>';
}

app.listen(port);
console.log('listening on port', port);
```

Now run the application in your favourite web browser and check that both views work.

---

[← Back to *building and offline news app, FT style*](../) | [Continue to *single/multi-page app* →](./02-single-multi-page)
