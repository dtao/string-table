stringTable = require('../stringTable.js')

describe 'stringTable', ->
  describe 'create', ->
    it 'makes a nicely formatted table from a list of objects', ->
      objects = [{ foo: 1, bar: 2 }, { foo: 3, bar: 4 }]

      expect(stringTable.create(objects)).toEqual(
        ' foo | bar \n' +
        '   1 |   2 \n' +
        '   3 |   4 '
      )

    it 'aligns strings to the left, other values to the right', ->
      objects = [{ foo: 'a', bar: 1 }, { foo: 'b', bar: 2 }]

      expect(stringTable.create(objects)).toEqual(
        ' foo | bar \n' +
        ' a   |   1 \n' +
        ' b   |   2 '
      )
