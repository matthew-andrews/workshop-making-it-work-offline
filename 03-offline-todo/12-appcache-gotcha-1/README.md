# AppCache Gotchas

Load up your app, edit a file (e.g. change the background colour in the CSS file).  Refresh the app.  What happens?

Your web application is now **offline first**.  That means it will load from cache first, do a background update and your users will *only see that update* when they press refresh.

Press refresh.  What do you see now?

With AppCache, a background update will only happen *if the application manifest itself changes*.  Because you haven't updated the `offline.appcache` file it won't update.

Now try loading the web application in an Private Browsing Window (Incognito in Chrome).  Notice it gets the most up-to-date version of the web application.

Now add a comment into the application cache, like this:

##### `offline.appcache`

```
CACHE MANIFEST
# v2
./styles.css
./indexeddb.shim.min.js
./promise.js
./application.js

NETWORK:
*
```

And with the developer console open, refresh both the non-private browsing and the private browsing application.

Notice that both update and re-download all the assets required for the application to load

## First AppCache Gotchas:-

- Updates happen in the background.  To see updates you must refresh the application **twice**.
- For AppCache enabled web applications to update, the application cache manifest file must change.
- When an AppCache update happens *all files* get re-downloaded.  Even if you only make a one line change in a single CSS file.

#### Exercises

- What happens if you set `Cache-Control` headers for the application cache for a very long time, for example a year or more?

#### Solutions

- That user gets stuck on that version of your application *for a year or more*.

---

[← Back to *appcache*](../11-appcache) | [Continue to *success* →](../13-success)
