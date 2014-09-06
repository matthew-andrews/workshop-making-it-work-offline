# Hacking AppCache

Try to implement AppCache using the same approach we tried for our previous prototypes.  Use `chrome://appcache-internal` to see which files have been saved.  What happens?

Use this snippet to serve an AppCache manifest from express:-

```js
app.get('/offline.appcache', function(req, res) {
  res.set('Content-Type', 'text/cache-manifest');
  res.send('CACHE MANIFEST'
    + '\n./application.js'
    + '\n./indexeddb.shim.min.js'
    + '\n./promise.js'
    + '\n./styles.css'
    + '\n./superagent.js'
    + '\n./templates.js'
    + '\n'
    + '\nFALLBACK:'
    + '\n/ /'
    + '\n'
    + '\nNETWORK:'
    + '\n*');
});
```

(We could do this by creating a static file, `/public/offline.appcache`, but you'll soon see why we've taken this approach)
