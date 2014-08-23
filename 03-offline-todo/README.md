# Offline todo with IndexedDB

We’re going to make a simple offline-first [to-do application](https://matthew-andrews.github.io/offline-todo/) with HTML5
technology.  Here is what the app will do:

- store data offline and load without an Internet connection;
- allow the user to add and delete items in the to-do list;
- store all data locally, with no back end;</li>
- run on the first- and second-most recent versions of all major desktop and mobile browsers.

## Which Technologies To Use

In an ideal world, we’d use just one client database technology. Unfortunately, we’ll have to use two:

- **IndexedDB** This is the standard for client-side storage and the [only option available on Firefox and Internet
Explorer](http://caniuse.com/indexeddb).
- **WebSQL** This is the deprecated predecessor to WebSQL and the [only option available on current versions of
iOS](http://caniuse.com/sql-storage) (although iOS 8 will finally give us IndexedDB).
</ul>

Veterans of the offline-first world might now be thinking, “But we could just use
[localStorage](http://caniuse.com/namevalue-storage), which has the benefits of a much simpler API, and we wouldn’t
need to worry about the complexity of using both IndexedDB and WebSQL.” While that is technically true,
[localStorage has number of problems](https://hacks.mozilla.org/2012/03/there-is-no-simple-solution-for-local-storage/),
the most important of which is that the amount of storage space available with it is significantly less than IndexedDB
and WebSQL.

Luckily, while we’ll need to use both, we’ll only need to think about IndexedDB. To support WebSQL, we’ll use an
[IndexedDB polyfill](https://github.com/axemclion/IndexedDBShim). This will keep our code clean and easy to maintain,
and once all browsers that we care about support IndexedDB natively, we can simply delete the polyfill.

**Note:** If you’re starting a new project and are deciding whether to use IndexedDB or WebSQL, I strongly advocate
using IndexedDB and the polyfill. In my opinion, there is no reason to write any new code that integrates with WebSQL
directly.

I’ll go through all of the steps using Google Chrome (and its developer tools), but there’s no reason why you couldn’t
develop this application using any other modern browser.

[Start by *scaffolding the application* →](./01-scaffolding)
