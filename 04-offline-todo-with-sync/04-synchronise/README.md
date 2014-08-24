# Synchronise

// todo - explain

```js
[…]

  function synchronise() {
    return Promise.all([serverTodosGet(), databaseTodosGet()])
      .then(function(results) {
        var promises = [];
        var remoteTodos = results[0].body;
        var localTodos = results[1];

        // Loop through local todos and if they haven't been
        // posted to the server, post them.
        promises = promises.concat(localTodos.map(function(todo) {
          var deleteTodo = function() {
            return databaseTodosDelete(todo);
          };

          // Has it been marked for deletion?
          if (todo.deleted) {
            return serverTodosDelete(todo).then(deleteTodo);
          }

          // If this is a todo that doesn't exist on the server try to create
          // it (if it fails because it's gone, delete it locally)
          if (!arrayContainsTodo(remoteTodos, todo)) {
            return serverTodosPost(todo)
              .catch(function(res) {
                if (res.status === 410) return deleteTodo();
              });
          }
        }));

        // Go through the todos that came down from the server,
        // we don't already have one, add it to the local db
        promises = promises.concat(remoteTodos.map(function(todo) {
          if (!arrayContainsTodo(localTodos, todo)) {
            return databaseTodosPut(todo);
          }
        }));
        return Promise.all(promises);
    }, function(err) {
      console.error(err, "Cannot connect to server");
    })
    .then(refreshView);
  }

[…]
```

// todo - explain


---

[← Back to *adding data*](../03-adding-ajax) | [Continue to *success* →](../05-success)
