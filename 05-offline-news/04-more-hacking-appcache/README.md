# More hacking AppCache

We've solved the AppCache problem for all pages except for the index page.

The home page of our application (`http://localhost:8080/`) is still cached in the AppCache, which means in order for us to download a new version we need to change the AppCache manifest.  There are a few hacks we could do here:-

We could add a timestamp to the AppCache manifest that changes whenever we make a change to our website.  This is hacky and would mean every content change would require our users to download our entire application every time we publish some new content.

Also this approach would duplicate the data we *already have stored offline* in IndexedDB.  This is not only wasteful but could mean that the articles stored in IndexedDB and the list of articles stored in AppCache could drift out of date with each other.

It violates our basic principle to only store application files in AppCache - and store only content in the client side database.

More hacking is required.

## Getting more control over AppCache

What if we could stored an empty shell of the application in AppCache and only use the server-side rendered pages for the initial load?  It's hacky, but possible:-

- Change the endpoints that return pages (either `/` or `/article/:guid` in our express app to return an empty shell if a special cooke (we'll call it `up`).
- Don't include the AppCache iframe loader by default - instead use JavaScript to insert it after setting the `up` cookie.  Remove the iframe once the AppCache update process is complete.

There's one more complication:-

- When a web app is loaded from the Application Cache, it will implicitly try to do AppCache update - even if that page itself doesn't have a `manifest` attribute.  Therefore if the `up` cookie is not set and `/offline.appcache` is requested we will return a `400` response.

Warning: do not return a 410 because that will cause the user's device to delete the AppCache and the web app will no longer work offline.

## Reacting to the `up` cookie in express.

- Add the express [cookie-parser](https://github.com/expressjs/cookie-parser) middleware.
- Remove the iframe from `layoutShell`.
- Respond to `GET /` and `GET /articles/:guid` with an empty shell of the application if the `up` cookie is set
- Respond to `GET /offline.appcache` with `400 Bad Request` if the `up` cookie is not set
- Add JavaScript to add the AppCache iframe when the application starts and remove it again once the AppCache update is complete.

##### [`/index.js`](./index.js)

```js
var api = 'https://offline-news-api.herokuapp.com/stories';
var port = 8080;

var cookieParser = require('cookie-parser');
var express = require('express');
var path = require('path');
var request = require('superagent');
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
console.log('listening on '+port);
```

##### [`public/iframe.html`](./public/iframe.html)

```html
<!DOCTYPE html>
<html manifest="/offline.appcache">
  <head>
    <title>FT Tech News</title>
  </head>
  <body>
    <script src="/iframe.js"></script>
  </body>
</html>
```

##### [`public/iframe.js`](./public/iframe.js)

```js
(function() {
  "use strict";

  var checkTimer = null, ac = window.applicationCache, status = null, hasChecked = false, loopMax = 60;

  function checkNow() {
    if (ac.status === ac.CHECKING || ac.status === ac.DOWNLOADING || ac.status === ac.UPDATEREADY) {
      hasChecked = true;
    }
    if (ac.status !== status) {
      status = ac.status;
      trigger(status, hasChecked);
    }
    if (loopMax--) {
      checkIn(1000);
    } else {
      trigger(-1, hasChecked);
    }
  }

  function checkIn(ms) {
    if (checkTimer) clearTimeout(checkTimer);
    checkTimer = setTimeout(checkNow, ms);
  }
  function trigger(evt, hasChecked) {
    if (parent && parent.window) {
      parent.window.postMessage({
        type: 'appcache:event',
        args: [evt, hasChecked]
      }, '*');
    }
  }

  ac.addEventListener('updateready', checkNow);
  ac.addEventListener('cached', checkNow);
  ac.addEventListener('checking', checkNow);
  ac.addEventListener('downloading', checkNow);
  ac.addEventListener('error', checkNow);
  ac.addEventListener('noupdate', checkNow);
  ac.addEventListener('obsolete', checkNow);
  ac.addEventListener('progress', checkNow);

  checkIn(250);
}());
```


##### [`public/appcache.js`](./public/appcache.js)

```js
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
```

## Exercises

- If you work on a reasonably sized website that uses a CDN to cache content what side effects could this have?

---

[← Back to *Hacking AppCache*](../03-hacking-appcache) | [Continue to *Success!* →](../05-success)
