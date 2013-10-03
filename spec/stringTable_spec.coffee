stringTable = require('../stringTable.js')

describe 'stringTable', ->
  juxtapose = (left, right, indentation) ->
    [leftRows, rightRows] = [left.split('\n'), right.split('\n')]
    output = for i in [0..Math.max(leftRows.length, rightRows.length)] 
      indent(indentation) + "#{leftRows[i] || ''}   #{rightRows[i] || ''}"
    output.join('\n')

  indent = (indentation) ->
    new Array(indentation + 1).join(' ')

  beforeEach ->
    this.addMatchers
      toMatchTable: (expectedTable) ->
        this.message = ->
          """
          Expected these tables to match:

          #{juxtapose(this.actual, expectedTable, 5)}
          """

        this.actual == expectedTable

  describe 'create', ->
    it 'makes a nicely formatted table from a list of objects', ->
      objects = [{ foo: 1, bar: 2 }, { foo: 3, bar: 4 }]

      expect(stringTable.create(objects)).toMatchTable(
        """
        | foo | bar |
        -------------
        |   1 |   2 |
        |   3 |   4 |
        """
      )

    it 'aligns strings to the left, other values to the right', ->
      objects = [{ foo: 'a', bar: 1 }, { foo: 'b', bar: 2 }]

      expect(stringTable.create(objects)).toMatchTable(
        """
        | foo | bar |
        -------------
        | a   |   1 |
        | b   |   2 |
        """
      )

    it 'aligns headings the same as their values', ->
      objects = [{ a: 'foo', b: 100 }, { a: 'bar', b: 200 }]

      expect(stringTable.create(objects)).toMatchTable(
        """
        | a   |   b |
        -------------
        | foo | 100 |
        | bar | 200 |
        """
      )

    it 'resizes rows to fit multiline strings', ->
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

      expect(stringTable.create(books)).toMatchTable(
        """
        | title              | opening                         |
        --------------------------------------------------------
        | The Cat in the Hat | The sun did not shine.          |
        |                    | It was too wet to play.         |
        |                    | So we sat in the house          |
        |                    | All that cold, cold, wet day.   |
        | Green Eggs and Ham | I am Sam.                       |
        |                    | Sam I am.                       |
        |                    | Do you like green eggs and ham? |
        """
      )

    describe 'customization', ->
      objects = [
        { a: 'app', b: 'bow', c: 'cow' },
        { a: 'arc', b: 'bra', c: 'cap' }
      ]

      it 'allows you to specify which column headings to include', ->
        expect(stringTable.create(objects, { headers: ['a', 'c'] })).toMatchTable(
          """
          | a   | c   |
          -------------
          | app | cow |
          | arc | cap |
          """
        )

      it 'provides the option of capitalizing column headings', ->
        things = [
          { foo: 'app', bar: 'bow' },
          { foo: 'arc', bar: 'bra' }
        ]

        expect(stringTable.create(things, { capitalizeHeaders: true })).toMatchTable(
          """
          | Foo | Bar |
          -------------
          | app | bow |
          | arc | bra |
          """
        )

      it 'allows you to specify custom outer and inner borders', ->
        options =
          outerBorder: '||'
          innerBorder: '*'

        expect(stringTable.create(objects, options)).toMatchTable(
          """
          || a   * b   * c   ||
          ---------------------
          || app * bow * cow ||
          || arc * bra * cap ||
          """
        )

      it 'allows you to specify a row separator', ->
        expect(stringTable.create(objects, { rowSeparator: ':' })).toMatchTable(
          """
          | a   | b   | c   |
          -------------------
          | app | bow | cow |
          :::::::::::::::::::
          | arc | bra | cap |
          """
        )

      it 'allows you to specify a custom header separator', ->
        expect(stringTable.create(objects, { headerSeparator: 'x' })).toMatchTable(
          """
          | a   | b   | c   |
          xxxxxxxxxxxxxxxxxxx
          | app | bow | cow |
          | arc | bra | cap |
          """
        )

      it 'allows you to specify a custom formatter for each column', ->
        options =
          formatters:
            c: (value) -> value.toUpperCase()

        expect(stringTable.create(objects, options)).toMatchTable(
          """
          | a   | b   | c   |
          -------------------
          | app | bow | COW |
          | arc | bra | CAP |
          """
        )

      it 'allows you to specify a custom formatter for a given type', ->
        numbers = [
          { name: 'one', value: 1 },
          { name: 'two', value: 2 },
          { name: 'three', value: 3 }
        ]

        options =
          typeFormatters:
            number: (value) -> value.toFixed(2)

        expect(stringTable.create(numbers, options)).toMatchTable(
          """
          | name  | value |
          -----------------
          | one   | 1.00  |
          | two   | 2.00  |
          | three | 3.00  |
          """
        )

      it 'gives precedence to a column-specific formatter before a type formatter', ->
        options =
          formatters:
            b: (value) -> value.toUpperCase(),
          typeFormatters:
            string: (value) -> value.substring(0, 2)

        expect(stringTable.create(objects, options)).toMatchTable(
          """
          | a  | b   | c  |
          -----------------
          | ap | BOW | co |
          | ar | BRA | ca |
          """
        )

      it 'can adjust column widths for colored output', ->
        require('colors')

        options =
          adjustForColoredOutput: true

        palette = [
          { name: 'success', color: 'green'.green },
          { name: 'info', color: 'blue'.blue },
          { name: 'warning', color: 'yellow'.yellow },
          { name: 'danger', color: 'red'.red }
        ]

        expect(stringTable.create(palette, options)).toMatchTable(
          """
          | name    | color  |
          --------------------
          | success | #{'green'.green}  |
          | info    | #{'blue'.blue}   |
          | warning | #{'yellow'.yellow} |
          | danger  | #{'red'.red}    |
          """
        )
