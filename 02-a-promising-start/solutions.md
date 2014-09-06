# Solutions

```js
function successful() {
  return new Promise(resolve, reject) {
    setTimeout(resolve, 1000);
  };
}
```

---

```js
function unsuccessful() {
  return new Promise(resolve, reject) {
    setTimeout(reject, 500);
  };
}
```

---

`then` actually takes two arguments - one for success, one for failure, and `catch(function() {})` is just shorthand for `then(undefined, function() {})`.

So really we are comparing the difference between:-

```js
promise
  .then(function() {
      alert("Success!");
    }, function() {
      alert("Fail!");
    });
```

And this:-

```js
promise
  .then(function() {
    alert("Success!");
  })
  .then(undefined, function() {
    alert("Fail!");
  });
```

When an error occurs promises _jump forward_ to the next `then` with a rejection callback.  So with`.then(funcA, funcB)` either `funcA` or `funcB` will be called (not both) - whereas with `.then(funcA).catch(funcB)` both `funcA` and `funcB` will get called (as they're separate steps).

[Read more detail about error handling in promises on HTML5 rocks](http://www.html5rocks.com/en/tutorials/es6/promises/#toc-error-handling)

---

- `all` resolves when **all** the promises passed into it resolve.  If any rejects, it immediately reject - discarding the results of all other promises, regardless of their result.
- `race` resolves **as soon as one** of the promises resolves or rejects.

Race could be useful in an offline web app when retrieving fresh data from a server that is also cached locally.

```js
Promise.race([getFromServer(), getFromCache()])
  .then(function() {
    // Put some data on screen
  });
```
