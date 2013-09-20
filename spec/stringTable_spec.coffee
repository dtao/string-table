stringTable = require('../stringTable.js')

describe 'stringTable', ->
  describe 'create', ->
    objects = [
      { foo: 1, bar: 2 },
      { foo: 3, bar: 4 }
    ]

    it 'makes a nicely formatted table from a list of objects', ->
      expect(stringTable.create(objects)).toEqual(
        ' foo | bar \n' +
        '   1 |   2 \n' +
        '   3 |   4 '
      )
