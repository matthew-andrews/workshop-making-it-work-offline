# Adding ajax

In order to communicate with the server we're going to need to implement some ajax functionality to communicate with our **[offline-todo-api](https://github.com/matthew-andrews/offline-todo-api)**.  I'm going to suggest using [superagent](https://github.com/visionmedia/superagent) but you could use vanilla javascript or jQuery if you prefer.

## Install ajax library

To add superagent we will need to make changes to `index.html`, `offline.appcache` and create a new file `superagent.js`.

##### `index.html`

```html
<!DOCTYPE html>
<html manifest="./offline.appcache">
  <head>
    <link rel='stylesheet' href='./styles.css' type='text/css' media='all' />
  </head>
  <body>
    <h1>Example: Todo</h1>
    <form>
      <input placeholder="Type something" />
    </form>
    <ul>
    </ul>
    <script src="./indexeddb.shim.min.js"></script>
    <script src="./promise.js"></script>
    <script src="./superagent.js"></script>
    <script src="./application.js"></script>
  </body>
</html>
```

##### `offline.appcache`

```
CACHE MANIFEST
./styles.css
./indexeddb.shim.min.js
./promise.js
./superagent.js
./application.js

NETWORK:
*
```

##### `superagent.js`

Download the contents of the [minified superagent polyfill](https://raw.githubusercontent.com/visionmedia/superagent/master/superagent.js), and put it in this file.

## Api wrapper methods

Now we have an ajax library installed and available to us in our application we are next going to implement a few helper methods that mirror the API of the database methods:

##### `application.js`

```js
(function() {
  var api = 'http://localhost:3000/todos';

[…]

  function serverTodosGet(_id) {
    return new Promise(function(resolve, reject) {
      superagent.get(api+'/' + (_id ? _id : ''))
        .end(function(err, res) {
          if (!err && res.ok) resolve(res);
          else reject(res);
        });
    });
  }

  function serverTodosPost(todo) {
    return new Promise(function(resolve, reject) {
      superagent.post(api)
        .send(todo)
        .end(function(res) {
          if (res.ok) resolve(res);
          else reject(res);
        });
    });
  }

  function serverTodosDelete(todo) {
    return new Promise(function(resolve, reject) {
      superagent.del(api + '/' + todo._id)
        .end(function(res) {
          if (res.ok) resolve();
          else reject();
        });
    });
  }
}());
```

---

[← Back to *mark for deletion*](../02-mark-for-deletion) | [Continue to *synchronise* →](03-synchronise)
