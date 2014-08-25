# Offline news website

We’re going to make a simple offline-first to-do application with HTML5 technology. Here is what the app will do:

- store data offline and load without an Internet connection;
- automatically download the latest stories when there is a good connection
- run on the first- and second-most recent versions of all major desktop and mobile browsers.

## Why news?

Content-based websites (which includes websites other than news sites, such as Wikipedia, where the focus is on **reading** rather than **doing** make up a huge proportion of the world wide web)
but are a use case that stretches AppCache to its limits.

This makes building a simple offline news website a good example to explore AppCache and its replacement, Service Worker, in depth.  Also it will be possible to takes these tips and tricks and apply them **immediately** to most websites.

## Prerequisites

As this is a front end course we're going to use a backend that I've already prepared.  If you are using a computer that has Node (v0.10+) installed then download, install and run **[offline news api](https://github.com/matthew-andrews/offline-news-api)**.

```
npm install -g offline-news-api
offline-news-api
```

Otherwise, deploy the **[offline news api](https://github.com/matthew-andrews/offline-news-api)** project to a new (free) Heroku app.

Verify that your server is running correctly by going to `http://localhost:3000/stories` (replacing `http://localhost:3000` as appropriate) and checking that JSON encoded array is returned.  (At this stage it's probably empty - `[]`)

---

[← Back to *success*](../04-offline-todo-with-sync/05-success) | [Continue to *scaffolding* →](01-scaffolding)
