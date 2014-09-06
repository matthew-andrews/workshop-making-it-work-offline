# Success!

## Summarize

Over the course of today we've covered **IndexedDB**, **AppCache** and **ServiceWorker** in depth.

- Stop implementing WebSQL code.  It's deprecated and Safari is getting it soon.  Use the IndexedDB polyfill instead.
- Offline applications are possible **today** [across 83% of the web](http://caniuse.com/#search=appcache) with AppCache.
- If you're using AppCache I highly recommend only storing **application files** in AppCache and only storing **content** in client database.
- Service Worker is coming, [track its status](https://github.com/jakearchibald/isserviceworkerready) and prepare your websites.

## Exercises

- Rebuild the todo app (either with or without sync) with Service Worker
