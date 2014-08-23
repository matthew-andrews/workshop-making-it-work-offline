# Deleting Items

To keep things as simple as possible, we will let users delete items by clicking on a delete button next to each of them.

To achieve this, we will be a little hacky and give each item an ID set to its `_id` (which is actually a timestamp). This will enable the click event listener, which we will add to the document’s body, to detect when the user clicks on a delete button (as opposed to anywhere else on the page).

##### `/application.js`

```js
(function() {
  var db, input, ul;

  databaseOpen()
    .then(function() {
      input = document.getElementsByTagName('input')[0];
      ul = document.getElementsByTagName('ul')[0];
      document.body.addEventListener('submit', onSubmit);
      document.body.addEventListener('click', onClick);
    })
    .then(refreshView);

  function onClick(e) {

    // We'll assume that any element with an ID
    // attribute is a to-do item. Don't try this at home!
    if (e.target.hasAttribute('id')) {
      databaseTodosGetById(e.target.getAttribute('id'))
        .then(function(todo) {
          return databaseTodosDelete(todo);
        })
        .then(refreshView);
    }
  }

[…]

  function refreshView() {
    return databaseTodosGet().then(renderAllTodos);
  }

  function renderAllTodos(todos) {
    var html = '';
    todos.forEach(function(todo) {
      html += todoToHtml(todo);
    });
    ul.innerHTML = html;
  }

  function todoToHtml(todo) {
    return '<li><button id="'+todo._id+'">delete</button>'+todo.text+'</li>';
  }

[…]

  function databaseTodosDelete(todo) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['todo'], 'readwrite');
      var store = transaction.objectStore('todo');
      var request = store.delete(todo._id);
      request.onsuccess = resolve;
      request.onerror = reject;
    });
  }

}());
```

We’ve made the following enhancements:

- We’ve added a new event handler (`onClick`) that listens to click events and checks whether the target element has an ID attribute. If it has one it calls databaseTodosDelete with that value and, if the item is successfully deleted, re-renders the to-do list following the same approach that we took in step 6.
- We’ve enhanced the `todoToHtml` function so that every to-do item is outputted with an ID attribute, set to its `_id`.
- We’ve added a new function, `databaseTodosDelete`, which takes a `todo` (well, a javascript object with an `_id` property) and returns a promise, deletes the item and then resolves the promise.

Our to-do app is basically feature-complete. We can add and delete items, and it works in any browser that supports WebSQL or IndexedDB (although it could be a lot more efficient).

---

[Continue to *AppCache for full offline experience* →](../07-appcache)
