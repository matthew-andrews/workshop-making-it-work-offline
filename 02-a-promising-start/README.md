# Promises

## What is a Promise?

Promises are are used to organise asynchronous logic.

## Why are we talking about it?

We're going to need Promises because new browser API, such as **Service Worker**, which we will cover later are built on top of them.  By covering them early we will be able to use them in all of our prototypes and exercises so that hopefully they will be second nature (if they aren't already) by the end of the day.	

Take for example messy logic.

```js
document.onsubmit = function(e) {
  e.preventDefault();
  var todo = document.getElementsByTagName('input')[0].value
  request({
    url: "https://offline-todo-api.herokuapp.com/todos",
    body: {
      created: Date.now(),
      text: todo
    },
    method: 'POST'
  }, function(err, response) {
    if (err) {
	  alert(err);
	} else {
	  alert('success');
	}
  });
};
```

Let's refactor this.

```js
document.onsubmit = function(e) {
  e.preventDefault();
  var todo = document.getElementsByTagName('input')[0].value
  postTodo({
    created: Date.now(),
    text: todo
  }, function(err, response) {
  	if (err) {
  	  alert(err);
  	} else {
  	  alert('success');
  	}
  });
};

function postTodo(todo, cb) {
  request({
    url: "https://offline-todo-api.herokuapp.com/todos",
    body: todo,
    method: 'POST'
  }, function(err, response) {
    cb(err, response);
  });
}
```
