# Rendering todos

In this section we will put in the plumbing that will use the methods we've already implemented to render the todos on to the page.

```js
(function() {
  var db, input, ul;

  databaseOpen()
    .then(function() {
      input = document.querySelector('input');
      ul = document.querySelector('ul');
      document.body.addEventListener('submit', onSubmit);
    })
    .then(refreshView);

  function onSubmit(e) {
    e.preventDefault();
    var todo = { text: input.value, _id: String(Date.now()) };
    databaseTodosPut(todo)
      .then(function() {
        input.value = '';
      })
      .then(refreshView);
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
    return '<li>'+todo.text+'</li>';
  }

[…]
```

- `todoToHtml` takes a single todo and converts it to a HTML string.
- `renderAllTodos` takes an array of todos, converts each of them HTML and then sets the `innerHTML` of the `ul` to those strings concatenated together.
- `refreshView` returns a promise then gets all the todos from the local database and passes them to `renderAllTodos`, which converts the todos to HTML and injects that HTML into the web page.
- We have also enhanced another method, the `onSubmit` event handler, so that the todos re-render as new todos are added.

---

[← Back to *getting data*](../07-getting-data) | [Continue to *deleting data* →](../09-deleting-data)
