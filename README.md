stringTable.js
==============

A groundbreaking, innovating JavaScript library to do something that's literally never been attempted before: formatting an array of data objects as a textual table.

```javascript
var objects = [
  { name: 'Dan', age: 29 },
  { name: 'Adam', age: 31 },
  { name: 'Lauren', age: 33 }
];

var table = stringTable.create(objects);

console.log(table);

/*
 * Output:
 *
 * | name   | age |
 * | Dan    |  29 |
 * | Adam   |  31 |
 * | Lauren |  33 |
```
