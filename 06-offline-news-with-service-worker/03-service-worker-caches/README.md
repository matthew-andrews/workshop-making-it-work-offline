# Sevice Worker Caches

## One tiny problem

Service Workers will be really helpful for creating offline apps.  Unfortunately they're not yet implemented any browser, even the very latest Firefox Nightlies or Chrome Canaries.  A [polyfill (using IndexedDB) has been created](https://github.com/jeffposnick/service-worker-cache), which we will use instead.

Due to a bug in Chrome the polyfill object is named `cachesPolyfill` (when Service Workers are released publicly this will change to simply `caches`.  All these code samples will use `cachesPolyfill` as that is the syntax that is currently needed.

## API

### `open`

Like IndexedDB to create a cache for storing data offline you must call `open` and give it a name.  This will return an ES6 promise.

```js
cachesPolyfill.open('my-first-sw-cache');
```

### `addAll`

To cache some URLs use the `addAll` method on the *object that the `cachesPolyfill` promise resolves with*.

```js
cachesPolyfill.open('my-first-sw-cache')
  .then(function(myCache) {
    myCache.addAll([
      '/scripts.js',
      '/styles.css',
      '/pic.png'
    ]);
  });
```

### `match`

As we saw in the previous part Service Workers can respond to `fetch` events so all that remains is to demonstrate how to respond to `fetch` events with appropriate content from `caches` and we will have made it work offline.

`caches` has a method `match` that will look through **all** the current Service Worker's caches, looking for a piece of content that **matches** the requested URL, method, vary headers.  (It will also ignore any cache headers - which is useful as often we would prefer the user to receive *something* even if that resource has technically expired if the alternative is for the user to get *nothing*).

```js
this.onfetch = function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
};
```

You can also customise how the matching works, [discounting things](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/#cache-query-options-dictionary) such as query string, methods, and vary headers.

## Exercise

- With this information create a version of the offline news application that works offline with Service Worker.
