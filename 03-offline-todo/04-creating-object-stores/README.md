# Creating object stores

Like many database formats that you might be familiar with, you can create many tables in a single IndexedDB database. These tables are called **objectStores**. In this step, we’ll create an object store named `todo`. To do this, we simply add an event listener on the database’s `upgradeneeded` event.
The data format that we will store to-do items in will be JavaScript objects, with two properties:

`timeStamp` This timestamp will also act as our key.
`text` This is the text that the user has entered.

For example:
```
{ timeStamp: 1407594483201, text: 'Wash the dishes' }
```

Now, `/application.js` looks like this (the new code starts at `request.onupgradeneeded`):

```js
(function() {

  // 'global' variable to store reference to the database
  var db;

  databaseOpen
    .then(function() {
      alert("The database has been opened");
    });

  function databaseOpen() {
    return new Promise(function(resolve, reject) {
      var version = 1;
      var request = indexedDB.open('todos', version);

      // Run migrations if necessary
      request.onupgradeneeded = function(e) {
        db = e.target.result;
        e.target.transaction.onerror = databaseError;
        db.createObjectStore('todo', { keyPath: 'timeStamp' });
      };
  
      request.onsuccess = function(e) {
        db = e.target.result;
        resolve();
      };
      request.onerror = reject;
    }
  });
}());
```

This will create an object store keyed by `timeStamp` and named `todo`.

## Or will it?

Having updated `application.js`, if you open the web app again, not a lot happens. The code in `onupgradeneeded` never runs; try adding a `console.log` in the `onupgradeneeded` callback to be sure. The problem is that we haven’t incremented the version number, so the browser doesn’t know that it needs to run the upgrade callback.

## How to solve this?

Whenever you add or remove object stores, you will need to increment the version number. Otherwise, the structure of the data will be different from what your code expects, and you risk breaking the application.
Because this application doesn’t have any real users yet, we can fix this another way: by deleting the database. Copy this line of code into the **Console**, and then refresh the page:

```js
indexedDB.deleteDatabase('todos');
```

After refreshing, the **Resources** pane of **Developer Tools** should have changed and should now show the object store that we added:
The Resources panel should now show the object store that was added.

![The “Resources” panel should now show the object store that was added](./screenshot.png)

## What we have done so far

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

---

[Continue to *adding data* →](../05-adding-data)
