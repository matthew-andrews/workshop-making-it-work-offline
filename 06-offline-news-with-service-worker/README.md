# Offline news with Service Worker

To get AppCache to work with our offline news website required us to write so many awful confusing hacks:-

- Varying the response of every page based on whether a cookie is set;
- Returning an HTTP error on the manifest when a cookie is not set;
- Created an iframe to load a page that loads the manifest rather than referencing it directly.
- Without the `NETWORK: *` hack in your AppCache manifest you will break all non-offline'd resources.

Luckily, a better way is coming.

## Service Worker

// todo into Service Worker
