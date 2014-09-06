# Single/Multi page app

Back in the introduction we laid down some basic ground rules about which offline technologies we were going to use to store the different kinds of data we need to.

- We will use **Application Cache** to store application assets, such as CSS, JavaScript and a basic HTML shell.
- We will use **IndexedDB** to store content - in this case, articles.

Because content stored in IndexedDB is not accessible to the Application Cache, in order to display pages offline we the website will need to transform into a single page app - whilst still being a normal website (multi-page app?) for the initial load.

In this step we will implement synchronisation and client-side and server-side rendering.

#### [`index.js`](./index.js)

On the server side we will need to add a few more JavaScript files to the `layoutShell` function.

```js
[...]

     + '\n  </head>'
     + '\n  <body>'
     + '\n    <main>'+data.main+'</main>'
     + '\n    <script src="/indexeddb.shim.min.js"></script>'
     + '\n    <script src="/superagent.js"></script>'
     + '\n    <script src="/promise.js"></script>'
     + '\n    <script src="/templates.js"></script>'
     + '\n    <script src="/application.js"></script>'
     + '\n  </body>'
     + '\n</html>';

[...]
```

#### Add libraries and polyfills

Copy over the polyfills for [*IndexedDB*](./public/indexeddb.shim.min.js), [*Promises*](./public/promise.js) and the [*Superagent*](./public/superagent.js) library from our previous prototypes and place the JavaScript files in `public`.
