# Adding items

The next step is to enable the user to add items.

##### /application.js

Note that I’ve omitted the database’s opening code, indicated by ellipses (…) below:

```js
(function() {
  var db, input;

  databaseOpen()
    .then(function() {
      input = document.getElementsByTagName('input')[0];
      document.body.addEventListener('submit', onSubmit);
    });

  function onSubmit(e) {
    e.preventDefault();
    var todo = { text: input.value, _id: String(Date.now()) };
    databasesTodosPut(todo)
      .then(function() {
        input.value = '';
      });
  }

[…]

  function databasesTodosPut(todo) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['todo'], 'readwrite');
      var store = transaction.objectStore('todo');
      var request = store.put(todo);
      request.onsuccess = resolve;
      request.onerror = reject;
    });
  }

}());
```

We’ve added two bits of code here:

- The event listener responds to every `submit` event, prevents that event’s default action (which would otherwise refresh the page), calls `databasesTodosPut` with the value of the `input` element, and (if the item is successfully added) sets the value of the `input` element to be empty.
- A function named `databasesTodosPut` returns a promise, stores the to-do item in the local database, along with a timestamp, and then resolves the promise.

To test that this works, open up the web app again. Type some words into the `input` element and press “Enter.” Repeat this a few times, and then open up “Developer Tools” to the “Resources” tab again. You should see the items that you typed now appear in the todo object store.

![After adding a few items, they should appear in the todo object store](./screenshot.jpg)

After adding a few items, they should appear in the todo object store.

[Continue to *updating data* →](../06-updating-data)
