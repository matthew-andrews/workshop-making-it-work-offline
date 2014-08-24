# Architecture

As with the simple offline todo app, we're going to take lots of shortcuts so that we can focus on covering the key ideas.

## Synchronisation

There are many ways to store data so that it can be synchronised and merged in with other changes that have happened since the last synchronisation.  For example, **git** stores changes made 'offline' as sequences of **diffs**.

For our todo application we are going to take the simplest possible route use the following algorithm for synchronising with the server:

- download all todos from the server, load all todos from the local database
- loop through all local todos
  - if a todo has been deleted locally, delete it from the server
  - if a todo isn't in the array of todos returned from the server, assume it's new and create it on the server
- loop through all the remote todos
  - if a todo isn't in the array of todos loaded from the local database, assume it's been created by another client since the last synchronisation and create it locally.
