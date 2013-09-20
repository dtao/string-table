stringTable.js
==============

A groundbreaking, innovative JavaScript library to do something that's literally never been attempted before: formatting an array of data objects as a textual table.

```javascript
var users = [
  { name: 'Dan', gender: 'M', age: 29 },
  { name: 'Adam', gender: 'M', age: 31 },
  { name: 'Lauren', gender: 'F', age: 33 }
];

var table = stringTable.create(users);

console.log(table);

/*
 * Output:
 *
 * | name   | gender | age |
 * -------------------------
 * | Dan    | M      |  29 |
 * | Adam   | M      |  31 |
 * | Lauren | F      |  33 |
 */
```

You can also specify options to customize how the table is formatted:

```javascript
var table = stringTable.create(users, options);
```

The available options are summarized below.

Options
-------

### `headers`

An array of strings indicating which column headers to include (and in what order)

*Default: every property from the first object in the list*

#### Example

```javascript
stringTable.create(users, { headers: ['age', 'name'] });

/*
 * Output:
 *
 * | age | name   |
 * ----------------
 * |  29 | Dan    |
 * |  31 | Adam   |
 * |  33 | Lauren |
 */
```

### `capitalizeHeaders`

Whether or not to capitalize the table's column headers

*Default: `false`*

#### Example

```javascript
stringTable.create(users, { capitalizeHeaders: true });

/*
 * Output:
 *
 * | Name   | Gender | Age |
 * -------------------------
 * | Dan    | M      |  29 |
 * | Adam   | M      |  31 |
 * | Lauren | F      |  33 |
 */
```

### `formatters`

An object mapping column names to formatter functions

*Default: none*

#### Example

```javascript
stringTable.create(users, {
  formatters: {
    name: function(value) { return value.toUpperCase(); }
  }
});

/*
 * Output:
 *
 * | name   | gender | age |
 * -------------------------
 * | DAN    | M      |  29 |
 * | ADAM   | M      |  31 |
 * | LAUREN | F      |  33 |
 */
```

### `outerBorder` and `innerBorder`

The character(s) used to enclose the table and to delimit cells within the table, respectively

*Defaults: `'|'` for both*

#### Example

```javascript
stringTable.create(users, {
  outerBorder: '%',
  innerBorder: '$'
});

/*
 * Output:
 *
 * % name   $ gender $ age %
 * -------------------------
 * % DAN    $ M      $  29 %
 * % ADAM   $ M      $  31 %
 * % LAUREN $ F      $  33 %
 */
```

### `headerSeparator`

The character used to separate the header row from the table body

*Default: `'-'`*

#### Example

```javascript
stringTable.create(users, { headerSeparator: '*' });

/*
 * Output:
 *
 * | name   | gender | age |
 * *************************
 * | Dan    | M      |  29 |
 * | Adam   | M      |  31 |
 * | Lauren | F      |  33 |
 */
```
