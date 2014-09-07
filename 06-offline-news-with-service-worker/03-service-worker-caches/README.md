# Sevice Worker Caches

// todo explain them


## One tiny problem

Service Workers will be really helpful for creating offline apps.  Unfortunately they're not yet implemented any browser, even the very latest Firefox Nightlies or Chrome Canaries.  A [polyfill (using IndexedDB) has been created](https://github.com/jeffposnick/service-worker-cache) but it's very out of date and doesn't match the current Service Worker specification - and, more importantly, currently causes Service Workers that use it to cache.

For now the recommendation is:-

- Use IndexedDB directly from within your Service Worker.
- Check the status of Cache objects on [the 'Is Service Worker Ready' website](https://jakearchibald.github.io/isserviceworkerready/#caches).
- Replace that with real Service Worker Cache objects when they become available.

## Exercise

- Write the IndexedDB code to _create_ a database with two object stores (one for application resources and one for news stories) within the Service Worker.
