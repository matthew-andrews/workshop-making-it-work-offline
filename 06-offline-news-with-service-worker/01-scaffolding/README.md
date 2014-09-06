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

This should be very familiar by now.
