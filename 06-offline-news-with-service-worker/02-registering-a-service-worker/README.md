# Registering a Service Worker

To get a Service Worker attached to our web page we need to use `navigator.serviceWorker.register`.  It's API is this:-

```js
Promise register(scriptURL, options);
```

All asynchronous APIs related to Service Workers, including `serviceWorker.register`, return [native browser Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - in fact we can throw away our Promise polyfill because browsers must support Promises before supporting Service Workers.

Once you've called `serviceWorker.register` the browser will load the Service Worker at the URL specified by `scriptURL` and fire the `install` event on it.  You can listen to that event within the Service Worker like this:-

```js
this.oninstall = function(e) {
  e.waitUntil(/* a promise */);
};
```

Passing a Promise into the `waitUntil` method on the event object tells the browser to `waitUntil` that Promise resolves - and once that promise resolves the Promise returned from `serviceWorker.register` on the page that registered the Service Worker will resolve.

## Exercise

- Register a Service Worker that listens to the `install` event on our news application.
- Find out how to open Dev Tools in a Service Worker and experiment with setting breakpoints.

---

[← Back to *Scaffolding*](../01-scaffolding) | [Continue to *Service Worker Cache* →](../03-service-worker-cache)
