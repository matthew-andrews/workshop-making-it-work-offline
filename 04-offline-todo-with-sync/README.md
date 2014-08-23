# Offline todo with IndexedDB with synchronisation

We will now enhance our simple offline-first to-do application by hooking it up to a server so that, when it has an internet connection, it can synchronise its data.  Here is what the app will do:

- everything that the previous app did, on as many browsers;
- synchronises its todos with the server, deleting todos on the server that have been deleted locally, added todos on the server that have been created locally.

## What technologies to use

Download, install and run **[offline todo api](https://github.com/matthew-andrews/offline-todo-api)**.

```
git clone git@github.com:matthew-andrews/offline-todo-api.git
cd offline-todo-api
npm install
node index.js
```
