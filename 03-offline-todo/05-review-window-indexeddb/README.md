## Review: `window.indexedDB`

Everything related to **IndexedDB** is accessed either directly or indirectly through `window.indexedDB`\*.

### Opening databases

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

```js
var request = window.indexedDB.open("todos", 2);

request.onupgradeneeded = function(e) {
  alert("Database upgrade needed");
};

request.onsuccess = function(e) {
  alert("Database deleted successfully");
};
```

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
var request = window.indexedDB.deleteDatabase("todos");
request.onsuccess = function(e) {
  alert("Database deleted successfully");
};
```

\* Again, may be subject to change, [see MDN](https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory.deleteDatabase).

---

[Continue to *adding data* →](../06-adding-data)
