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

// todo

### Requests

// todo

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
  var transaction = db.transaction(['todo'], 'readwrite');
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

// todo

#### Cursors

[`IDBCursors`](https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor) can be used to look up data by their index as well as sort data within an object store.  Usage of them is normally out of scope for this course - but here are a few links that introduce the key ideas:

- [`IDBCursor` documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor)
- [How to do some magic with indexedDB](http://www.codeproject.com/Articles/744986/How-to-do-some-magic-with-indexedDB)

### Exercises

- Reverse the order of the todos so that they added to the top, not the bottom, in our demo.
- Write code to update an existing item in an object store.
- What would be different if we'd have used `add` instead of `put`?  What are the benefits of one over the other?
- Write code that selects items from an object store that instead of waiting for all of them to come back before rendering those items onto the page, immediately render each one.  What approaches or browser APIs instead of Promises could be more appropriate to implement this?
