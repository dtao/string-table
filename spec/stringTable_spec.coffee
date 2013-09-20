stringTable = require('../stringTable.js')

describe 'stringTable', ->
  juxtapose = (left, right, indentation) ->
    [leftRows, rightRows] = [left.split('\n'), right.split('\n')]
    output = for leftRow, i in leftRows
      indent(indentation) + "#{leftRow}   #{rightRows[i]}"
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
