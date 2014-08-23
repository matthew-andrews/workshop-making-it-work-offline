# Opening an IndexedDB database

### `/application.js`

```js
(function() {

  // 'global' variable to store reference to the database
  var db;

  databaseOpen()
    .then(function() {
      alert("The database has been opened");
    });

  function databaseOpen(callback) {
    return new Promise(function(resolve, reject) {
      var version = 1;
      var request = indexedDB.open('todos', version);
      request.onupgradeneeded = function(e) {
        db = e.target.result;
        e.target.transaction.onerror = reject;
        db.createObjectStore('todo', { keyPath: '_id' });
      };
      request.onsuccess = function(e) {
        db = e.target.result;
        resolve();
      };
      request.onerror = reject;
    });
  }

}());
```

All this code does is create a database with indexedDB.open and then show the user an old-fashioned alert if it is successful. Every IndexedDB database needs a name (in this case, todos) and a version number (which I’ve set to 1).

To check that it’s working, open the application in the browser, open up “Developer Tools” and click on the “Resources” tab.

![Screenshot of the IndexedDB in Dev Tools](./screenshot.jpg)

### What's going on here?

Everything related to **IndexedDB** is accessed either directly or indirectly through `window.indexedDB`\*.

In our application, we start by *requesting* an IndexedDB database named `todos` be opened.

```js
var request = indexedDB.open('todos', version);
```

#### Current syntax\**

```js
IDBOpenDBRequest open (DOMString name, [EnforceRange] optional unsigned long long version);
```

When `open` is called, if a database of this name already exists, the browser will give us that - if not, it will create a new one.  If the database is successfully opened a `success` event will be
fired on the `IDBOpenDBRequest` object.

The `version` parameter allows us to be able to change the schema of the database.  If we want to add or remove 'tables' (called Object Stores) we must implement the logic for doing that within
`onupgradeneeded`.  Note, the *only* time browser will let us add, remove or edit the structure of Object Stores is within the `onupgradeneeded` callback.

Note: `upgradeneeded` events will fire when the data is first created **as well as** when the version number has changed.  In addition to the 'just created case' if your database has changed more
than once (for example, if the current verson if 3) your `onupgradeneeded` event handler must be able to handle upgrading databases from version 1 to 3 as well as version 2 to 3.  **This can get
quite complicated for applications whose database schemas change frequently**.

\* Documentation for this object is often filed under `IDBFactory`.  `IDBFactory` is an **interface** that `window.indexedDB` *implements* (and indeed the *nly* object that implements this
interface).

\*\* May be subject to change, [see MDN](https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory.open)

### Deleting Databases

Deleting IndexedDB databases is also done via the `window.indexedDB` object via the `window.indexedDB.deleteDatabase` method.

#### Current syntax\*

```js
IDBOpenDBRequest deleteDatabase (DOMString name);
```

#### Example

```js
var request = window.indexedDB.deleteDatabase("toDoList");
request.onsucess = function(e) {
  alert("Database deleted successfully");
};
```

\* Again, may be subject to change, [see MDN](https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory.deleteDatabase).
