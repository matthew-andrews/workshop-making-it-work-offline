# More hacking AppCache

We've solved the AppCache problem for all pages except for the index page.

The home page of our application (`http://localhost:8080/`) is still cached in the AppCache, which means in order for us to download a new version we need to change the AppCache manifest.  There are a few hacks we could do here:-

We could add a timestamp to the AppCache manifest that changes whenever we make a change to our website.  This is hacky and would mean every content change would require our users to download our entire application every time we publish some new content.

Also this approach would duplicate the data we *already have stored offline* in IndexedDB.  This is not only wasteful but could mean that the articles stored in IndexedDB and the list of articles stored in AppCache could drift out of date with each other.

It violates our basic principle to only store application files in AppCache - and store only content in the client side database.

More hacking is required.

## Getting more control over AppCache

What if we could stored an empty shell of the application in AppCache and only use the server-side rendered pages for the initial load?  It's hacky, but possible:-

- Change the endpoints that return pages (either `/` or `/article/:guid` in our express app to return an empty shell if a special cooke (we'll call it `up`).
- Don't include the AppCache iframe loader by default - instead use JavaScript to insert it after setting the `up` cookie.  Remove the iframe once the AppCache update process is complete.

There's one more complication:-

- When a web app is loaded from the Application Cache, it will implicitly try to do AppCache update - even if that page itself doesn't have a `manifest` attribute.  Therefore if the `up` cookie is not set and `/offline.appcache` is requested we will return a `400` response.

Warning: do not return a 410 because that will cause the user's device to delete the AppCache and the web app will no longer work offline.

## Reacting to the `up` cookie in express.



## Exercises

- If you work on a reasonably sized website that uses a CDN to cache content what side effects could this have?

---

[← Back to *Hacking AppCache*](../03-hacking-appcache) | [Continue to *Success!* →](../05-success)
