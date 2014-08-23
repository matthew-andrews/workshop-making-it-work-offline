# Opening an IndexedDB database

##### `/application.js`

```js
(function() {
  var db;

  databaseOpen()
    .then(function() {
      alert("The database has been opened");
    });

  function databaseOpen() {
    return new Promise(function(resolve, reject) {
      var version = 1;
      var request = indexedDB.open('todos', version);
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

---

[← Back to *Scaffolding the application*](../01-scaffolding) | [Continue to *using dev tools* →](../03-using-dev-tools)
