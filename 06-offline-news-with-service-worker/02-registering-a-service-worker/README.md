# Registering a Service Worker

To get a Service Worker attached to our web page we need to use `navigator.serviceWorker.register`.  It's API is this:-

```
Promise register(scriptURL, options);
```

All asynchronous APIs related to Service Workers return [native browser Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - in fact we can throw away our Promise polyfill because browsers must support Promises before supporting Service Workers.
