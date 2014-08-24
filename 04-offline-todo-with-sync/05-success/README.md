# Success!

## Bonus exercises

- Currently the synchronisation logic can run multiple times simulataneously.  Although we have to handle this for the case of multiple tabs open in the same browser so *should work* it is quite wasteful and will generate a lot of unnecessary http requests.  How could you change the synchronisation logic so that it will not start if it's already running?
- The **[offline-todo-api](https://github.com/matthew-andrews/offline-todo-api)** offers a [server sent events](http://www.html5rocks.com/en/tutorials/eventsource/basics/) end point that will stream notifications to clients whenever a todo is created or deleted.  Add code to subscribe to this stream so that todos that are deleted or created by other devices synchronise near instantly.  What other technologies would work here?

---

[← Back to *synchronise*](../04-synchronise) | [Continue to *building an offline news website* →](../../05-offline-news)
