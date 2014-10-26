# Introducing [Dexie.js](https://github.com/dfahlander/Dexie.js)

[Dexie.js](https://github.com/dfahlander/Dexie.js) is a wrapper around IndexedDB that I believe will become the jQuery of IndexedDB.

## Advantages

- Simple **Promise-based** API
- Human readable queries `db.friends.where('lastName').anyOf('Helenius', 'Fahlander').each(function(friends) { … })`
- Error handling
- Supports search
- Only one layer away from actual IndexedDB objects - not difficult to migrate code from manual IndexedDB integration to Dexie.
- Cross-browser (but you'll still need to polyfill IndexedDB on WebSQL browsers)

## Disadvantages

- Slightly funky object store key syntax, but I think we can forgive them for that…

## Key ideas

- You no longer need to wait for the database to be opened - start using it as if it were already opened immediately and the internals will take care of the rest
- No need to think about transactions (unless you want to) - it's all handled internally

## Todo app IndexedDB integration in Dexie.js

```js
[…]

db.version(1).stores({ todo: '_id' });
db.open()
	.then(refreshView);

function onClick(e) {
	e.preventDefault();
	if (e.target.hasAttribute('id')) {
		db.todo.where('_id').equals(e.target.getAttribute('id')).delete()
			.then(refreshView);
	}
}

function onSubmit(e) {
	e.preventDefault();
	db.todo.put({ text: input.value, _id: String(Date.now()) })
		.then(function() {
			input.value = '';
		})
		.then(refreshView);
}

function refreshView() {
	return db.todo.toArray()
		.then(renderAllTodos);
}

[…]
```
