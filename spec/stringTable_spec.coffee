stringTable = require('../stringTable.js')

describe 'stringTable', ->
  describe 'create', ->
    it 'makes a nicely formatted table from a list of objects', ->
      objects = [{ foo: 1, bar: 2 }, { foo: 3, bar: 4 }]

      expect(stringTable.create(objects)).toEqual(
        """
        | foo | bar |
        |   1 |   2 |
        |   3 |   4 |
        """
      )

    it 'aligns strings to the left, other values to the right', ->
      objects = [{ foo: 'a', bar: 1 }, { foo: 'b', bar: 2 }]

      expect(stringTable.create(objects)).toEqual(
        """
        | foo | bar |
        | a   |   1 |
        | b   |   2 |
        """
      )

    it 'aligns headings the same as their values', ->
      objects = [{ a: 'foo', b: 100 }, { a: 'bar', b: 200 }]

      expect(stringTable.create(objects)).toEqual(
        """
        | a   |   b |
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
        expect(stringTable.create(objects, { headers: ['a', 'c'] })).toEqual(
          """
          | a   | c   |
          | app | cow |
          | arc | cap |
          """
        )

      it 'allows you to specify custom outer and inner borders', ->
        options =
          outerBorder: '||'
          innerBorder: '*'

        expect(stringTable.create(objects, options)).toEqual(
          """
          || a   * b   * c   ||
          || app * bow * cow ||
          || arc * bra * cap ||
          """
        )

      it 'allows you to specify a custom formatter for each column', ->
        options =
          formatters:
            c: (value) -> value.toUpperCase()

        expect(stringTable.create(objects, options)).toEqual(
          """
          | a   | b   | c   |
          | app | bow | COW |
          | arc | bra | CAP |
          """
        )
