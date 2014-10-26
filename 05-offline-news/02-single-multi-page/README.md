# Single/Multi page app

Back in the introduction we laid down some basic ground rules about which offline technologies we were going to use to store the different kinds of data we need to.

- We will use **Application Cache** to store application assets, such as CSS, JavaScript and a basic HTML shell.
- We will use **IndexedDB** to store content - in this case, articles.

Because content stored in IndexedDB is not accessible to the Application Cache, in order to display pages offline we the website will need to transform into a single page app - whilst still being a normal website (multi-page app?) for the initial load.

In this step we will implement synchronisation and client-side and server-side rendering.

##### [`/index.js`](./index.js)

On the server side we will need to add a few more JavaScript files to the `layoutShell` function.

```js
[…]

     + '\n  </head>'
     + '\n  <body>'
     + '\n    <main>'+data.main+'</main>'
     + '\n    <script src="/indexeddb.shim.min.js"></script>'
     + '\n    <script src="/superagent.js"></script>'
     + '\n    <script src="/promise.js"></script>'
     + '\n    <script src="/templates.js"></script>'
     + '\n    <script src="/application.js"></script>'
     + '\n  </body>'
     + '\n</html>';

[…]
```

##### Add libraries and polyfills

Copy over the polyfills for [**IndexedDB**](./public/indexeddb.shim.min.js), [**Promises**](./public/promise.js) and the [**Superagent**](./public/superagent.js) library from our previous prototypes and place the JavaScript files in `public`.

##### [`/application.js`](./public/application.js)

1. Opens a database
2. Synchronises with the `/stories`, adding stories that have been added and deleting stories that have been removed
3. Uses `window.templates.list()` and `window.templates.article()` to render those articles.
4. Uses `history.pushState` to update the URL when a user clicks on an article or when they click to view list of articles and refreshes the content on screen with that of the requested page.
5. Bonus: integrate this with Google analytics so that link click that is handled on the client side is turned into a `pageview` event and tracked.

Try to do use the work we have done already in previous prototypes copying the solution.

```js
(function() {
  var api = 'https://offline-news-api.herokuapp.com/stories';
  var synchronizeInProgress;
  var db, main;

  databaseOpen()
    .then(function() {
      main = document.querySelector('main');
      document.body.addEventListener('click', onClick);
      window.addEventListener('popstate', refreshView);

      // Only refresh the view if the view is empty
      if (main.innerHTML === '') return refreshView();
    })
    .then(synchronize);

  function onClick(e) {
    if (e.target.classList.contains('js-link')) {
      e.preventDefault();
      history.pushState({}, '', e.target.getAttribute('href'));
      refreshView();
    }
  }

  function refreshView() {
    var guidMatches = location.pathname.match(/^\/article\/([0-9]+)/);
    if (!guidMatches) {
      renderAllStories();
      return databaseStoriesGet().then(renderAllStories);
    }
    renderOneStory();
    return databaseStoriesGetById(guidMatches[1]).then(renderOneStory);
  }

  function renderAllStories(stories) {
    main.innerHTML = templates.list(stories);
  }

  function renderOneStory(story) {
    if (!story) story = { title: 'Story cannot be found', body: '<p>Please try another</p>' };
    main.innerHTML = templates.article(story);
  }

  function synchronize() {
    if (synchronizeInProgress) return synchronizeInProgress;
    synchronizeInProgress = Promise.all([serverStoriesGet(), databaseStoriesGet()])
      .then(function(results) {
        var promises = [];
        var remoteStories = results[0];
        var localStories = results[1];

        // Add new stories downloaded from server to the database
        promises = promises.concat(remoteStories.map(function(story) {
          if (!arrayContainsStory(localStories, story)) {
            return databaseStoriesPut(story);
          }
        }));

        // Delete stories that are no longer on the server from the database
        promises = promises.concat(localStories.map(function(story) {
          if (!arrayContainsStory(remoteStories, story)) {
            return databaseStoriesDelete(story);
          }
        }));

        return promises;
      })

      // Only refresh the view if it's listing page
      .then(function(results) {
        if (location.pathname === '/') {
          return refreshView();
        }
      })
      .then(function() {
        synchronizeInProgress = undefined;
      });
  }

  function arrayContainsStory(array, story) {
    return array.some(function(arrayStory) {
      return arrayStory.guid === story.guid;
    });
  }

  function databaseOpen() {
    return new Promise(function(resolve, reject) {
      var version = 1;
      var request = indexedDB.open('news-server-rendered', version);
      request.onupgradeneeded = function(e) {
        db = e.target.result;
        e.target.transaction.onerror = reject;
        db.createObjectStore('stories', { keyPath: 'guid' });
      };
      request.onsuccess = function(e) {
        db = e.target.result;
        resolve();
      };
      request.onerror = reject;
    });
  }

  function databaseStoriesPut(story) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['stories'], 'readwrite');
      var store = transaction.objectStore('stories');
      var request = store.put(story);
      request.onsuccess = resolve;
      request.onerror = reject;
    });
  }

  function databaseStoriesGet() {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['stories'], 'readonly');
      var store = transaction.objectStore('stories');

      var keyRange = IDBKeyRange.lowerBound(0);

      // Using reverse direction because the index being sorted on
      // ends with a numerical incrementing ID so to get newest news
      // first you need to sort by largest first.
      var cursorRequest = store.openCursor(keyRange, 'prev');

      var data = [];
      cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        if (result) {
          data.push(result.value);
          result.continue();
        } else {
          resolve(data);
        }
      };
    });
  }

  function databaseStoriesGetById(guid) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['stories'], 'readonly');
      var store = transaction.objectStore('stories');
      var request = store.get(guid);
      request.onsuccess = function(e) {
        var result = e.target.result;
        resolve(result);
      };
      request.onerror = reject;
    });
  }

  function databaseStoriesDelete(story) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['stories'], 'readwrite');
      var store = transaction.objectStore('stories');
      var request = store.delete(story.guid);
      request.onsuccess = resolve;
      request.onerror = reject;
    });
  }

  function serverStoriesGet(guid) {
    return new Promise(function(resolve, reject) {
      superagent.get(api+'/' + (guid ? guid : ''))
        .end(function(err, res) {
          if (!err && res.ok) resolve(res.body);
          else reject(res);
        });
    });
  }
})();
```

---

[← Back to *scaffolding*](../01-scaffolding) | [Continue to *hacking appcache* →](../03-hacking-appcache)
