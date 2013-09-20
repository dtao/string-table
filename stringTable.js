(function(module) {

  function createTable(records) {
    if (!records || records.length === 0) {
      return '';
    }

    var headers = Object.keys(records[0]),
        rows    = [headers];

    for (var i = 0; i < records.length; ++i) {
      rows.push(createRow(records[i], headers));
    }

    var columnWidths = [];
    for (var i = 0; i < rows[0].length; ++i) {
      columnWidths.push(getMaxWidth(rows, i));
    }

    var formattedRows = [],
        currentRow;
    for (var i = 0; i < rows.length; ++i) {
      currentRow = [];
      for (var j = 0; j < rows[i].length; ++j) {
        currentRow.push(pad(rows[i][j], columnWidths[j]));
      }
      formattedRows.push(' ' + currentRow.join(' | ') + ' ');
    }

    return formattedRows.join('\n');
  }

  function createRow(data, headers) {
    var row = [];
    for (var i = 0; i < headers.length; ++i) {
      row.push(data[headers[i]]);
    }
    return row;
  }

  function getMaxWidth(rows, columnIndex) {
    var maxWidth = 0;
    for (var i = 0; i < rows.length; ++i) {
      maxWidth = Math.max(maxWidth, String(rows[i][columnIndex]).length);
    }
    return maxWidth;
  }

  function pad(value, width) {
    var padding = width - String(value).length;

    if (typeof value === 'string') {
      return value + repeat(' ', padding);
    }

    return repeat(' ', padding) + value;
  }

  function repeat(value, count) {
    return new Array(count + 1).join(value);
  }

  var stringTable = {
    create: createTable
  };

  module.exports = module.stringTable = stringTable;

}(typeof module !== 'undefined' ? module : this));
