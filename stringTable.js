(function(module) {

  function createTable(records, options) {
    if (!records || records.length === 0) {
      return '';
    }

    options = options || {};

    var headers     = options.headers || Object.keys(records[0]),
        outerBorder = options.outerBorder || '|',
        innerBorder = options.innerBorder || '|',
        formatters  = options.formatters || {}
        rows        = [headers];

    for (var i = 0; i < records.length; ++i) {
      rows.push(createRow(records[i], headers, formatters));
    }

    var columnWidths = [];
    for (var i = 0; i < rows[0].length; ++i) {
      columnWidths.push(getMaxWidth(rows, i));
    }

    var columnTypes = [];
    for (var i = 0; i < rows[0].length; ++i) {
      columnTypes.push(getColumnType(rows, i));
    }

    var formattedRows = [],
        currentRow;
    for (var i = 0; i < rows.length; ++i) {
      currentRow = [];
      for (var j = 0; j < rows[i].length; ++j) {
        currentRow.push(formatCell(rows[i][j], columnWidths[j], columnTypes[j]));
      }

      formattedRows.push([
        outerBorder,
        currentRow.join(' ' + innerBorder  + ' '),
        outerBorder
      ].join(' '));
    }

    return formattedRows.join('\n');
  }

  function createRow(data, headers, formatters) {
    var row = [];
    for (var i = 0; i < headers.length; ++i) {
      (function(header) {
        var formatter = formatters[header] || identity;
        row.push(formatter(data[header]));
      }(headers[i]));
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

  function getColumnType(rows, columnIndex) {
    return rows[1] && typeof rows[1][columnIndex];
  }

  function formatCell(value, width, type) {
    var padding = width - String(value).length;

    if (type === 'string') {
      return value + repeat(' ', padding);
    }

    return repeat(' ', padding) + value;
  }

  function repeat(value, count) {
    return new Array(count + 1).join(value);
  }

  function identity(value) {
    return value;
  }

  var stringTable = {
    create: createTable
  };

  module.exports = module.stringTable = stringTable;

}(typeof module !== 'undefined' ? module : this));
