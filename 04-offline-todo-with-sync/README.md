# Offline todo with IndexedDB and synchronization

We will now enhance our simple offline-first to-do application by hooking it up to a server so that, when it has an internet connection, it can synchronize its data.  Here is what the app will do:

- everything that the previous app did, on as many browsers;
- synchronizes its todos with the server, deleting todos on the server that have been deleted locally, added todos on the server that have been created locally.
- works across different browsers on different devices, different browsers on the same device, browsers in private browsing mode and across different open tabs.

---

[← Back to *success*](../03-offline-todo/10-success) | [Continue to *architecture* →](01-architecture)
