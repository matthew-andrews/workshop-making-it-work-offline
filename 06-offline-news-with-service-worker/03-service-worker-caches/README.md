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
