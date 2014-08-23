# Truly Offline

Have we actually built an offline-first to-do app?  Almost, but not quite.  While we can now store all data offline, if you switch off your device’s Internet connection and try loading the application, it won’t open.  To fix this, we need to use the HTML5 Application Cache.

## Warning

While HTML5 Application Cache works reasonably well for a simple single-page application like this, it doesn’t always. Thoroughly research how it works before considering whether to apply it to your website.

- Service Worker might soon replace HTML5 Application Cache, although it is not currently usable in any browser, and neither Apple nor Microsoft have publicly committed to supporting it.
- To enable the application cache, we’ll add a `manifest` attribute to the `html` element of the web page.

#### `/index.html`

```html
<!DOCTYPE html>
<html manifest="./offline.appcache">
[…]
```

Then, we’ll create a manifest file, which is a simple text file in which we crudely specify the files to make available offline and how we want the cache to behave.

```
/OFFLINE.APPCACHE
CACHE MANIFEST
./styles.css
./indexeddb.shim.min.js
./application.js

NETWORK:
*
```

The section that begins `CACHE MANIFEST` tells the browser the following:

- When the application is first accessed, download each of those files and store them in the application cache.
- Any time any of those files are needed from then on, load the cached versions of the files, rather than redownload them from the Internet.

The section that begins `NETWORK` tells the browser that all other files must be downloaded fresh from the Internet every time they are needed.

## Check

Verify the application works offline by loading it up and then switching off the static web server (or if you're using a webserver disconnect your device from the internet) and press refresh.
