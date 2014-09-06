# Scaffolding

We're going to go back to the simple implementation of the online only news app we built [at the beginning of part 5](../05-offline-news/01-scaffolding#indexjs).  (Well almost, we're going to need to be able to render the entire page - on the client so we'll move `layoutShell` into [`public/templates.js`](./public/templates.js).

## Set up a quick *Express* server

In a new folder, create some files and a directory:-

- [`/public`](./public) - a new directory
- [`/public/styles.css`](./public/style.css) - some simple styles
- [`/public/templates.js`](./public/templates.js) - templating functions that will be shared between the server and the client
- [`/index.js`](./index.js) - this will be our express server
- [`/package.json`](./package.json) - this will be for listing our dependencies, initially all this will need to contain is `{}`.

```
echo '{}' >> test.json # Neat trick if you're using *nix
npm install --save express superagent
```

##### [`public/styles.css`](./public/styles.css)

```css
body {
  margin: 0;
  padding: 0;
  font-family: helvetica, sans-serif;
}
* {
  box-sizing: border-box;
}
h1 {
  padding: 14px 0 14px 0;
  margin: 0;
  font-size: 44px;
  border-bottom: solid 1px #DDD;
  line-height: 1em;
}
nav {
  padding: 14px 0 14px 0;
}
main {
  padding: 0 14px;
}
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
li {
  padding: 20px 0 20px 0;
  border-bottom: solid 1px #DDD;
}
```

##### [`public/templates.js`](./public/templates.js)

```js
(function() {
  var exports = {
    list: list,
    article: article
  };

  function list(data) {
    var ul = '';
    data.forEach(function(story) {
      ul += '<li><a class="js-link" href="/article/'+story.guid+'">'+story.title+'</a></li>';
    });
    return shell({
      main: '<h1>FT Tech Blog</h1><ul>'+ul+'</ul>'
    });
  }

  function article(data) {
    return shell({
      title: data.title,
      main: '<nav><a class="js-link" href="/">&raquo; Back to FT Tech Blog</a></nav><h1>'+data.title+'</h1>'+data.body
    });
  }

  function shell(data) {
    data = {
      title: data && data.title || 'FT Tech News',
      main: data && data.main || ''
    };
    return '<!DOCTYPE html>'
      + '\n<html>'
      + '\n  <head>'
      + '\n    <title>'+data.title+'</title>'
      + '\n    <link rel="stylesheet" href="/styles.css" type="text/css" media="all" />'
      + '\n  </head>'
      + '\n  <body>'
      + '\n    <div class="brandrews"><a href="https://mattandre.ws">mattandre.ws</a> | <a href="https://twitter.com/andrewsmatt">@andrewsmatt</a></div>'
      + '\n    <main>'+data.main+'</main>'
      + '\n    <script src="/templates.js"></script>'
      + '\n    <script src="/application.js"></script>'
      + '\n  </body>'
      + '\n</html>';
  }

  if (typeof module == 'object') {
    module.exports = exports;
  } else {
    this.templates = exports;
  }
}());
```

This is a little different - the `shell` function has been moved to `./public/templates.js` from `./index.js` as the Service Worker will now need to use it on the client side.  We've also taken the opportunity to simplify the way the templating functions work.  Now when you call `list` or `article` you get an entire HTML page.
