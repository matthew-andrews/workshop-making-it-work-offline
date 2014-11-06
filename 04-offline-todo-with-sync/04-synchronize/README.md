# Synchronize

As a reminder the algorithm we decided to use for synchronization was:

- download all todos from the server, load all todos from the local database
- loop through all local todos
  - if a todo has been deleted locally, delete it from the server
  - if a todo isn't in the array of todos returned from the server, assume it's new and create it on the server
- loop through all the remote todos
  - if a todo isn't in the array of todos loaded from the local database, assume it's been created by another client since the last synchronisation and create it locally.

##### `application.js`

```js
[…]

  function synchronize() {
    return Promise.all([serverTodosGet(), databaseTodosGet()])
      .then(function(results) {
        var promises = [];
        var remoteTodos = results[0];
        var localTodos = results[1];

        // Loop through local todos and if they haven't been
        // posted to the server, post them.
        promises = promises.concat(localTodos.map(function(todo) {
          var deleteTodo = function() {
            return databaseTodosDelete(todo);
          };

          // Has it been marked for deletion?
          if (todo.deleted) {
            return serverTodosDelete(todo).then(deleteTodo, function(res) {
              if (err.message === "Gone") return deleteTodo();
            });
          }

          // If this is a todo that doesn't exist on the server try to create
          // it (if it fails because it's gone, delete it locally)
          if (!arrayContainsTodo(remoteTodos, todo)) {
            return serverTodosPost(todo)
              .catch(function(err) {
                if (err.message === "Gone") return deleteTodo(todo);
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

  function arrayContainsTodo(array, todo) {
    for (var i = 0; i < array.length; i++) {
       if(array[i]._id === todo._id) {
         return true;
       }
    };
    return false;
  }

[…]
```


---

[← Back to *adding data*](../03-adding-ajax) | [Continue to *success* →](../05-success)
