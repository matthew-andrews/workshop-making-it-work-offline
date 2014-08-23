# Using dev tools

To check that it’s working, open the application in the browser, open up “Developer Tools” and click on the “Resources” tab.

![Screenshot of the IndexedDB in Chrome Dev Tools](./chrome.jpg)

## Challenge

Verify the database has been correctly created and is version 1 in Firefox, Chrome, IE (if you are using Windows) and Safari.

### Firefox

- download [the IndexedDB browser](https://addons.mozilla.org/en-us/firefox/addon/indexeddb-browser/),
- find your profile folder, `cd ~/Library/Application\ Support/Firefox/Profiles/1yj54vgo.default/`.
- Create a symbolic link: `ln -s ./storage/persistent/ ./indexedDB`

![Firefox IndexedDB Dev Tools](./firefox.png)

### Safari

Safari is also a little different because it does not yet support IndexedDB in stable.  You can however still verify that the polyfill has correctly set the database up in WebSQL.

![Safari IndexedDB Dev Tools](./safari.png)

[Continue to *creating object stores* →](../04-creating-object-stores)
