stringTable.js
==============

[![Build Status](https://travis-ci.org/dtao/stringTable.js.png)](https://travis-ci.org/dtao/stringTable.js)

A groundbreaking, innovative JavaScript library to do something that's [literally](https://github.com/JanGorman/node-table) [never](https://github.com/eldargab/easy-table) [been](https://github.com/substack/text-table) [attempted](https://github.com/sorensen/ascii-table) before: formatting an array of data objects as a textual table.

Installation
------------

    npm install string-table

Example
-------

```javascript
var users = [
  { name: 'Dan', gender: 'M', age: 29 },
  { name: 'Adam', gender: 'M', age: 31 },
  { name: 'Lauren', gender: 'F', age: 33 }
];

stringTable.create(users);

/*
 * Result:
 *
 * | name   | gender | age |
 * -------------------------
 * | Dan    | M      |  29 |
 * | Adam   | M      |  31 |
 * | Lauren | F      |  33 |
 */
```

It works with multi-line strings, too!

```coffeescript
# This example is in CoffeeScript for readability.

books = [
  {
    title: 'The Cat in the Hat',
    opening:
      """
      The sun did not shine.
      It was too wet to play.
      So we sat in the house
      All that cold, cold, wet day.
      """
  },
  {
    title: 'Green Eggs and Ham',
    opening:
      """
      I am Sam.
      Sam I am.
      Do you like green eggs and ham?
      """
  }
]

stringTable.create(books)

#
# Result:
#
# | title              | opening                         |
# --------------------------------------------------------
# | The Cat in the Hat | The sun did not shine.          |
# |                    | It was too wet to play.         |
# |                    | So we sat in the house          |
# |                    | All that cold, cold, wet day.   |
# | Green Eggs and Ham | I am Sam.                       |
# |                    | Sam I am.                       |
# |                    | Do you like green eggs and ham? |
#
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
 * Result:
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
 * Result:
 *
 * | Name   | Gender | Age |
 * -------------------------
 * | Dan    | M      |  29 |
 * | Adam   | M      |  31 |
 * | Lauren | F      |  33 |
 */
```

### `formatters`

An object mapping column names to formatter functions, which will accept `(value, header)` arguments

*Default: none*

#### Example

```javascript
stringTable.create(users, {
  formatters: {
    name: function(value, header) { return value.toUpperCase(); }
  }
});

/*
 * Result:
 *
 * | name   | gender | age |
 * -------------------------
 * | DAN    | M      |  29 |
 * | ADAM   | M      |  31 |
 * | LAUREN | F      |  33 |
 */
```

A formatter may also return an object with the properties `{ value, format }`, where `format` in turn can have the properties `{ color, alignment }`.

```javascript
stringTable.create(users, {
  formatters: {
    gender: function(value, header) {
      return {
        value: value,
        format: {
          color: value === 'M' ? 'cyan' : 'magenta',
          alignment: 'right'
        }
      };
    }
  }
});

/*
 * Result:
 *
 * | name   | gender |    age |
 * ----------------------------
 * | Dan    |      M |  29.00 |
 * | Adam   |      M |  31.00 |
 * | Lauren |      F |  33.00 |
 *
 * (Imagine the Ms are cyan and the F is magenta above.)
 */
```

### `typeFormatters`

An object mapping data *types* (`'string'`, `'number'`, `'boolean'`, etc.) to formatter functions (has lower precedence than `formatters` option)

*Default: none*

#### Example

```javascript
stringTable.create(users, {
  typeFormatters: {
    number: function(value, header) { return value.toFixed(2); }
  }
});

/*
 * Result:
 *
 * | name   | gender |    age |
 * ----------------------------
 * | Dan    | M      |  29.00 |
 * | Adam   | M      |  31.00 |
 * | Lauren | F      |  33.00 |
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
 * Result:
 *
 * % name   $ gender $ age %
 * -------------------------
 * % Dan    $ M      $  29 %
 * % Adam   $ M      $  31 %
 * % Lauren $ F      $  33 %
 */
```

### `rowSeparator`

The character used to separate rows in the table

*Default: none*

#### Example

```javascript
stringTable.create(users, { rowSeparator: '~' });

/*
 * Result:
 *
 * | name   | gender | age |
 * -------------------------
 * | Dan    | M      |  29 |
 * ~~~~~~~~~~~~~~~~~~~~~~~~~
 * | Adam   | M      |  31 |
 * ~~~~~~~~~~~~~~~~~~~~~~~~~
 * | Lauren | F      |  33 |
 */
```

### `headerSeparator`

The character used to separate the header row from the table body

*Default: `'-'`*

#### Example

```javascript
stringTable.create(users, { headerSeparator: '*' });

/*
 * Result:
 *
 * | name   | gender | age |
 * *************************
 * | Dan    | M      |  29 |
 * | Adam   | M      |  31 |
 * | Lauren | F      |  33 |
 */
```
