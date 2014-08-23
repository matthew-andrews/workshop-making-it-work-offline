# Promises

## What is a Promise?

Promises are are used to organise asynchronous logic.

## Why are we talking about it?

We're going to need Promises because new browser APIs, such as **Service Worker** which we will cover later, are built on top of them.  By covering them early we will be able to use them in all of our prototypes and exercises so that hopefully they will be second nature (if they aren't already) by the end of the day.	

Take for example messy logic that **POST**s two todos to the server and opens an alert when it's done (or an alert if one fails).

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
- Error handling is messy...

## What are we aiming for?

If we didn't need to worry about the asynchronous ajax request we'd probably write something like this:-

```js
try {
  var response1 = request({
    url: "https://offline-todo-api.herokuapp.com/todos",
    body: {
      _id: 'my-first-todo',
      text: 'Buy some bread'
    },
    method: 'POST'
  });
  var response2 = request({
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
  ).then(function success() {
    alert('success!');
  }, function failure() {
    alert('something failed');
  });
```
