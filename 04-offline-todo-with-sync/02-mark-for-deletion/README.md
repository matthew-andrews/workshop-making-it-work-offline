# Marking items for deletion

Rather than directly deleting todo items we need to change our client side code to *mark todos for deletion*.

To achieve this we are going to need to make the following changes:

- change the `onClick` handler, which deletes individual todos, from directly deleting the todo to setting a new `deleted` property to `true`
- enhance the `databaseTodosGet` method so that todos can be filtered by their deleted status.
- update `refreshView`'s use of `databaseTodosGet` so that it only renders undeleted todos.
- we won't delete the `databaseTodosDelete` method, even though it is now unused as the synchronisation logic that we will implement later will make use of it.
