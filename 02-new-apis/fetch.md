# Fetch

By now I hope I've convinced you that ES6 Promises are the one and only solution to asynchronous flow and that — if you're anything like me — will no longer be able to look at a web api built in the Pre-Promise era without cringing.

Let's talk about ajax.

```js
function success(response) { /* do something */ }
var request = new XMLHttpRequest();
request.onreadystatechange = function() {
  if (request.readyState === 4) {
    if (request.status === 200) {
      success(request.response);
    }
  }
};
request.open('https://offline-news-api.herokaupp.com/stories');
request.send();
```

OK, to be fair nobody actually writes this.  They'll normally do something like:-

```js
function success(response) { /* do something */ }
$.get('https://offline-news-api.herokaupp.com/stories', success);
```

Which is much better but what's the point of a standard API that is so difficult to use nobody uses it?

What would be nice if browsers shipped with a simple, _Promise_ based API for _fetching_ ajax requests…

```js
fetch('https://offline-news-api.herokaupp.com/stories')
  .then(success);
```

[Luckily other people think this is a good idea too](http://fetch.spec.whatwg.org/), and is the mechanism you *must* use within Service Worker, which we'll cover later.  Oddly though Chrome hasn't made this available in the front end, however the lovely people at [GitHub](https://www.github.com/github/fetch) have built a polyfill for modern browsers.

## Gotchas

The Fetch API builds on top of the W3C Streams _as well as_ Promises.  This is good as there are times where you won't want to wait for an ajax request to finish loading before you want to use the data it's downloading — in these cases you can pipe that raw stream of downloaded data into different bits of your application.  JavaScript streams are out of scope for this workshop but you can read more about them on the [Stream Handbook](https://github.com/substack/stream-handbook).

Warning: the Fetch Polyfill _only_ implements the Promise part of the API, *not* the Streams part.

The reason why I mention it is that the `fetch` API returns a Promise that resolves with a Response object that gives you access to *streams* — not an object containing all the data you requested.  You need to then convert that into the data format you want.  For example:-

```js
fetch('http://mattandre.ws/my-json-file.json')
  .then(function(response) {
    return response.json();
  });
```

## Exercises

- Use the Fetch API to create a, delete a and download all the todos from the API described: https://github.com/matthew-andrews/offline-todo-api.

---

[← Back to *Promises*](./) | [Continue to *offline todo with IndexedDB* →](../03-offline-todo)
