# Rendering todos

In this section we will put in the plumbing that will use the methods we've already implemented to render the todos on to the page.

```js
(function() {
  var db, input, ul;

  databaseOpen()
    .then(function() {
      input = document.getElementsByTagName('input')[0];
      ul = document.getElementsByTagName('ul')[0];
      document.body.addEventListener('submit', onSubmit);
    })
    .then(refreshView);

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
    return '<li>'+todo.text+'</li>';
  }

[…]
```

- `todoToHtml` takes a single todo and converts it to a HTML string.
- `renderAllTodos` takes an array of todos, converts each of them HTML and then sets the `innerHTML` of the `ul` to those strings concatenated together.
- `refreshView` returns a promise then gets all the todos from the local database and passes them to `renderAllTodos`, which converts the todos to HTML and injects that HTML into the web page.

---

[Continue to *deleting data* →](../09-deleting-data)
