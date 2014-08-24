# Success!

## Bonus exercises

- Currently the synchronization logic can run multiple times simulataneously.  Although we have to handle this for the case of multiple tabs open in the same browser so *should work* it is quite wasteful and will generate a lot of unnecessary http requests.  How could you change the synchronization logic so that it will not start if it's already running?
- The **[offline-todo-api](https://github.com/matthew-andrews/offline-todo-api)** offers a [server sent events](http://www.html5rocks.com/en/tutorials/eventsource/basics/) end point that will stream notifications to clients whenever a todo is created or deleted.  Add code to subscribe to this stream so that todos that are deleted or created by other devices synchronize near instantly.  What other technologies would work here?
- We've sort of hacked filtering by `deleted` status into `databaseTodosGet` and are currently quite wasteful - they will retrieve *all* the todos before filtering.  Write a migration that adds `deleted` as an index and enhance `databaseTodosGet` so that we can read just the todos we are interested in directly from IndexedDB.

---

[← Back to *synchronize*](../04-synchronize) | [Continue to *building an offline news website* →](../../05-offline-news)
