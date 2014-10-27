# Adding ajax

In order to communicate with the server we're going to need to implement some ajax functionality to communicate with our **[offline-todo-api](https://github.com/matthew-andrews/offline-todo-api)**.  I'm going to suggest using Fetch [(well, a polyfill of it)](https://github.com/github/fetch) but you could use `XMLHttpRequest`, jQuery or other libraries if you prefer.

## Install ajax library

As the Fetch API isn't implemented in any browsers yet, we will need to use a polyfill instead, which will mean we will need to make changes to `index.html`, `offline.appcache` and create a new file `fetch.js`.

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
    <script src="./fetch.js"></script>
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
./fetch.js
./application.js

NETWORK:
*
```

##### `fetch.js`

Download the contents of the [Fetch API polyfill](https://raw.githubusercontent.com/github/fetch/master/fetch.js), and put it in this file.

## Api wrapper methods

Now we have an ajax library installed and available to us in our application we are next going to implement a few helper methods that mirror the API of the database methods:

##### `application.js`

```js
(function() {
  var api = 'https://offline-todo-api.herokuapp.com/todos';

[…]

  function serverTodosGet(_id) {
    return fetch(api + '/' + (_id ? _id : ''))
      .then(function(response) {
        return response.json();
      });
  }

  function serverTodosPost(todo) {
    return fetch(api, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
      })
        .then(function(response) {
          if (response.status === 410) throw new Error(response.statusText);
	  return response;
	});
  }

  function serverTodosDelete(todo) {
    return fetch(api + '/' + todo._id, { method: 'delete' })
  }
}());
```

---

[← Back to *mark for deletion*](../02-mark-for-deletion) | [Continue to *synchronize* →](../04-synchronize)
