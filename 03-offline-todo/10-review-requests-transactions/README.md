# Review `IDBRequest` and `IDBTransaction`

Now that we've covered selecting, inserting and deleting data with IndexedDB let's review the functions we've used.

## Inserting data

```js
var transaction = db.transaction(['todo'], 'readwrite');
var store = transaction.objectStore('todo');
var request = store.put(todo);
transaction.oncomplete = resolve;
```

To insert a item into the object store we first need to create a **transaction**.  In IndexedDB all changes to the database, whether they be reads, updates, adds, deletions or changes to the structure all need to be wrapped in a transaction

You can do multiple reads, adds, updates, deletes or changes to the structure in a single transaction - but if any fail - the whole transaction fails none of the changes are applied.

You can only make changes to the structure of the database during a callback to the `upgradeneeded` event just after the database has been set up.

Transactions can only be created by calling `transaction` method on the `IDBDatabase` database.

### Transactions

```js
IDBTransaction transaction ((DOMString or sequence<DOMString>) storeNames, optional IDBTransactionMode mode = "readonly");
```
- `storeNames` - an array of object stores that your transaction needs to access.
- `mode` - there are two modes for transactions: `readwrite` or `readonly`.

#### Warning

Use `transaction.oncomplete` and not `request.onsuccess` as the point where you know the data has been stored.

### Object Stores

You can think of Object Stores as similar to tables in a SQL database.  You can have many object stores per database, and they can contain many objects - indexed by at least one index.  Object Stores are accessed via transaction objects.  For example:-

```js
var transaction = db.transaction['todo'], 'readonly');
var store = transaction.objectStore('todo');
```

### Requests

Requests are the only objects that you can use to _read_ or _write_ data with IndexedDB.  You can get to the results of each request using event handlers on the request objects.

Results are created by the methods on object stores such as `IDBObjectStore#add`, `IDBObjectStore#delete` , `IDBObjectStore#createIndex`, `IDBObjectStore#openCursor`, etc.  A special type of `IDBRequest` called `IDBOpenDBRequest` that we covered in the previous review is created by `IDBFactory#open` and `IDBFactory#deleteDatabase`.

## Deleting data

```js
var transaction = db.transaction(['todo'], 'readwrite');
var store = transaction.objectStore('todo');
var request = store.delete(todo._id);
transaction.oncomplete = resolve;
```

We can now talk through each line and explain what it does:-

- Create an `IDBTransaction` object with `readwrite` access to the `todo` object store, assign it to `transaction`
- Get an `IDBStore` object that represents the object store `todo` and assign it to `store`
- Create a request to `delete` object with ID `todo._id` from `store`
- When complete, `resolve` the promise

## Getting data

```js
  var transaction = db.transaction(['todo'], 'readonly');
  var store = transaction.objectStore('todo');

  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

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
```

- As we're only getting data we only need to create a `readonly` transaction.
- Then we get an `IDBStore` object that represents the object store `todo` and assigns it to `store` - in the same way deleting works above.
- The next two lines are concerned with creating a cursor (an object that allows us to walk through the database).  The line `IDBKeyRange.lowerBound(0)` simply says start from the beginning of the table.
- As data is pulled out of the table `success` events are fired on the cursor.  In each callback we must call `continue` to proceed to the next `result`, and if that `result` is empty we know we've reached the end of the dataset.

#### Cursors

[`IDBCursors`](https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor) can be used to look up data by their index as well as sort data within an object store.  Usage of them is normally out of scope for this course - but here are a few links that introduce the key ideas:

- [`IDBCursor` documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor)
- [How to do some magic with indexedDB](http://www.codeproject.com/Articles/744986/How-to-do-some-magic-with-indexedDB)

### Exercises

- Try changing `transaction.oncomplete` to `request.onsuccess` inside `databaseTodosPut` in your todo app.  What happens when you create todos?  Why?
- Reverse the order of the todos so that they added to the top, not the bottom, in our demo.
- What would be different if we'd have used `add` instead of `put`?  What are the benefits of one over the other?
- Aside from `cursorRequest.lowerBound` what other approaches could you take to retrieving all the data from a table?
- _Bonus:_ Write code that selects items from an object store that instead of waiting for all of them to come back before rendering those items onto the page, immediately render each one.  What approaches or browser APIs instead of Promises could be more appropriate to implement this?
- _Bonus:_ Support the ability to update existing items on our todo list.

---

[← Back to *deleting todos*](../09-deleting-todos) | [Continue to *truly offline* →](../11-appcache)
