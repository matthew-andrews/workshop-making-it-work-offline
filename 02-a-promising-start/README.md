# Promises

## What is a Promise?

> The Promise interface **represents a proxy for a value not necessarily known when the promise is created**. It allows you to associate handlers to an asynchronous action's eventual success or failure. **This lets asynchronous methods return values like synchronous methods**: instead of the final value, the asynchronous method returns a promise of having a value at some point in the future.
>
> A pending promise can become either **fulfilled with a value**, or **rejected with a reason**. When either of these happens, the associated handlers queued up by a promise's then method are called. (If the promise has already been fulfilled or rejected when a corresponding handler is attached, the handler will be called, so there is no race condition between an asynchronous operation completing and its handlers being attached.)
>
> As the `Promise.prototype.then` and `Promise.prototype.catch` methods return promises, they can be chained—an operation called composition.

\- Source: [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), emphasis mine.

In short, Promises are a way to organise asynchronous logic.

## Why are we talking about it?

We're going to need Promises because new browser APIs, such as **Service Worker** which we will cover later, are built on top of them.  By covering them early we will be able to use them in all of our prototypes and exercises so that hopefully they will be second nature (if they aren't already) by the end of the day.	

Take for example messy logic that **POSTs** two todos to the server and opens an alert when both have succeeded (or an alert if one fails).

```js
request({
  url: "https://offline-todo-api.herokuapp.com/todos",
  body: {
    _id: 'my-first-todo',
    text: 'Buy some bread'
  },
  method: 'POST'
}, function(err) {
  var firstSuccess = !!err;
  request({
    url: "https://offline-todo-api.herokuapp.com/todos",
    body: {
      _id: 'my-second-todo',
      text: 'Buy some bread'
    },
    method: 'POST'
  }, function(err) {
    var secondSuccess = !!err;
    if (firstSuccess && secondSuccess) {
      alert('success!');
    } else {
      alert('something failed');
    }
  });
});
```

## What's wrong with this code?

- Difficult to follow
- The second request doesn't start until the first is complete (they could be running at the same time)
- Error handling is messy

## What are we aiming for?

If we didn't need to worry about the asynchronous ajax request we'd probably write something like this:-

```js
try {
  var responses = [];
  responses[0] = request({
    url: "https://offline-todo-api.herokuapp.com/todos",
    body: {
      _id: 'my-first-todo',
      text: 'Buy some bread'
    },
    method: 'POST'
  });
  responses[1] = request({
    url: "https://offline-todo-api.herokuapp.com/todos",
    body: {
      _id: 'my-second-todo',
      text: 'Buy some bread'
    },
    method: 'POST'
  });
  alert('success!');
} catch(e) {
  alert('something failed');
}
```

### Promises let us write code like this.

```js
Promise.all(
  [
    request({
      url: "https://offline-todo-api.herokuapp.com/todos",
      body: {
        _id: 'my-first-todo',
        text: 'Buy some bread'
      },
      method: 'POST'
    }),
    request({
      url: "https://offline-todo-api.herokuapp.com/todos",
      body: {
        _id: 'my-second-todo',
        text: 'Buy some bread'
      },
      method: 'POST'
    })
  ]
  ).then(function success(responses) {
    alert('success!');
  }, function failure() {
    alert('something failed');
  });
```

### Nice things about promises

- Abstracts the complexity of dealing with asynchronous logic - lets you write performant but (relatively) simple code.
- Allows you to deal with errors in asynchronous libraries in a sensible way.

### Maybe not so nice things about promises

- Most browser methods were made pre-promises and so need wrapping to be useful.
- Cannot pipe data.  (eg. it might be nice for ajax request that returned a lot of data to start passing that data to the application as soon as data starts being received.  With promises you must wait until *all the data arrives* before your application will get to see *any of it*.

### Like them or not they're here to stay

- Browsers now support them natively, Node v0.11 ships with them built in
- Old familiar APIs (e.g. XMLHttpRequest) may be replaced by new shiny promising versions (e.g. request)
- They are a fundamental building block to ServiceWorkers, which will be a key component of today's workshop
- Many, many languages support promises (even [ReactPHP](https://github.com/reactphp/promise)) or equivalents (sometimes called futures - promises were actually first proposed in 1976)

### Exercises

Create a function that returns a promise that successfully resolves after 1 second with `setTimeout`

---

Create a function that returns a promise that rejects a promise after half a second with `setTimeout`

---

Explain the difference between this:-

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
  .catch(function() {
    alert("Fail!");
  });
```

---

Explain the difference between this:-

```js
Promise.all([promise1, promise2])
  .then(function() {
    alert("Success!");
  });
```

And this:-

```js
Promise.race([promise1, promise2])
  .then(function() {
    alert("Success!");
  });
```

When might race be useful in an offline web application?

---

[← Back to *meet the dysfunctional family*](../01-introduction/dysfunctional-family.md) | [Continue to *offline todo with IndexedDB* →](../03-offline-todo)
