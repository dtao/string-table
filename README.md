stringTable.js
==============

A groundbreaking, innovating JavaScript library to do something that's literally never been attempted before: formatting an array of data objects as a textual table.

```javascript
var objects = [
  { name: 'Dan', gender: 'M', age: 29 },
  { name: 'Adam', gender: 'M', age: 31 },
  { name: 'Lauren', gender: 'F', age: 33 }
];

var table = stringTable.create(objects);

console.log(table);

/*
 * Output:
 *
 * | name   | gender | age |
 * | Dan    | M      |  29 |
 * | Adam   | M      |  31 |
 * | Lauren | F      |  33 |
 */
```

You can also specify options to customize how the table is formatted:

```javascript
var table = stringTable.create(objects, options);
```

The available options are summarized below.

Options
-------

- `headers` (e.g., `['name', 'age']`): an array of strings indicating which column headers to include
