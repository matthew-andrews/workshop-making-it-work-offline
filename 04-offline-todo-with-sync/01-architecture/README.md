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

This algorithm is clearly extremely inefficient as it requires downloading all the todos in one go, it requires holding all the todos that exist in memory at once, and it requires walking through all the data to figure out what needs updating.  We get away with this because the size of the data we expect for our todos is quite small.

### Delete Corollary 1: we can't just delete todos anymore

By choosing this approach to synchronisation if we continue to directly delete todos from the local database as we are at the moment, the synchronisation algorithm isn't going to be able to distinguish todos that have been previously synced with the server but deleted locallly from todos that have been added by other clients but haven't yet been downloaded.

To work around this instead of deleting todos we will *mark todos for deletion* and only delete them once we are sure that the server has successfully deleted them.

### Delete Corollary 2: the server can never delete todos

Again because of the choice to use this approach to synchronisation in order for clients to be able to distinguish between todos that have been just created locally and not synced (and so exist locally but not on the server) and those that have been deleted by other clients (and so exist locally but not on the server) the server can never *actually* delete todos - only mark them for deletion.

Luckily the API we've chosen to use already [does this already](https://github.com/matthew-andrews/offline-todo-api#delete-todosid---delete-a-todo) and returns a `410 Gone` response for all `POST` and `GET` requests keyed for todos with `_id`s that have already been deleted.

## Appropriate `_id`s

With distributed applications where it is possible to create records on clients independently from the server choosing a sensible way to uniquely identify records turns out to be challenging.

### Why you can't just use auto-increment to create a local ID and let the server fill in a remote ID later:

- Say you create a new todo and it was allocated an ID of 2 whilst your browser is offline.
- You have the application open in two tabs when the browser connects to the internet and both begin syncing at the same time.
- Both simulataneously `POST` the new todo to the server.
- Because the server hasn't yet allocated the todo its permanent unique identifier, it cannot distinguish the two todos from each other and so creates it twice.

You could work around this by requiring all todo text to be unique but that would probably be undesireable for a todo app.

#### Other alternatives

- **Hash the todo and use it as an ID.**  Also requires todo text to be unique with the additional problem that once you've created and deleted a todo item you can never re-add a todo item with the same text again.
- **Generate a UUID.** The FT solved a similar problem to solve in their article authoring tool by generating a 36 character unique identifier for all articles with a one-in-a-million-like chance of colliding with another.  This would work well but adds complexity to the application.
- **Only support the creation of todos online.** Worthy of a mention and useful for existing systems.  Afterall, *some* offline behaviour is a huge improvement on *none*.
- Use the **timestamp** at the point the todo was created.  Although there are likely to be bugs collisions if two clients create a todo at precisely the same moment.  Also relies on the device's clock being set to some extent.

### Conclusion

There is no simple solution that works in all cases.  For real world applications (that use this synchronisation algorithm) I would either choose to use some sort of uuid or to try to find a way to make local ids with remote ids lazily filled tab-safe.

For the purpose of this demonstration prototype we will we use the **timestamp** option because it's by far the simplest.

---

[← Back to *offline todo with IndexedDB and sync*](../) | [Continue to *mark for deletion* →](./02-mark-for-deletion)
