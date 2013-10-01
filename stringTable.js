(function(module) {

  function createTable(records, options) {
    if (!records || records.length === 0) {
      return '';
    }

    options = options || {};

    var headers           = options.headers || Object.keys(records[0]),
        outerBorder       = options.outerBorder || '|',
        innerBorder       = options.innerBorder || '|',
        headerSeparator   = options.headerSeparator || '-',
        capitalizeHeaders = options.capitalizeHeaders || false,
        formatters        = options.formatters || {},
        typeFormatters    = options.typeFormatters || {},
        coloredOutput     = options.adjustForColoredOutput || false,
        rows              = [createHeaderRow(headers, capitalizeHeaders)];

    for (var i = 0; i < records.length; ++i) {
      rows.push(createRow(records[i], headers, formatters, typeFormatters));
    }

    var totalWidth =
      // Width of outer border on each side
      (strLength(outerBorder, coloredOutput) * 2) +

      // There will be an inner border between each cell, hence 1 fewer than total # of cells
      (strLength(innerBorder, coloredOutput) * (headers.length - 1)) +

      // Each cell is padded by an additional space on either side
      (headers.length * 2);

    var columnWidths = [];
    for (var i = 0; i < rows[0].length; ++i) {
      (function(columnIndex) {
        var columnWidth = getMaxWidth(rows, columnIndex, coloredOutput);
        columnWidths.push(columnWidth);
        totalWidth += columnWidth;
      }(i));
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
        currentRow.push(formatCell(rows[i][j], columnWidths[j], columnTypes[j], coloredOutput));
      }

      formattedRows.push([
        outerBorder,
        currentRow.join(' ' + innerBorder  + ' '),
        outerBorder
      ].join(' '));

      // Add the header separator right after adding the header
      if (i === 0) {
        formattedRows.push(createHeaderSeparator(totalWidth, headerSeparator));
      }
    }

    return formattedRows.join('\n');
  }

  function createRow(data, headers, formatters, typeFormatters) {
    var row = [];
    for (var i = 0; i < headers.length; ++i) {
      (function(header, columnIndex) {
        var value = data[header];

        var formatter = formatters[header] ||
          typeFormatters[typeof value] ||
          identity;

        row.push(formatter(value));

      }(headers[i], i));
    }
    return row;
  }

  function createHeaderRow(headers, capitalizeHeaders) {
    var row = Array.prototype.slice.call(headers, 0);
    if (capitalizeHeaders) {
      for (var i = 0; i < row.length; ++i) {
        row[i] = capitalize(row[i]);
      }
    }
    return row;
  }

  function createHeaderSeparator(totalWidth, separator) {
    return repeat(separator, totalWidth);
  }

  function getMaxWidth(rows, columnIndex, coloredOutput) {
    var maxWidth = 0;
    for (var i = 0; i < rows.length; ++i) {
      maxWidth = Math.max(maxWidth, strLength(rows[i][columnIndex], coloredOutput));
    }
    return maxWidth;
  }

  function getColumnType(rows, columnIndex) {
    return rows[1] && typeof rows[1][columnIndex];
  }

  function capitalize(value) {
    if (!value) {
      return value;
    }

    return value.charAt(0).toUpperCase() + value.substring(1);
  }

  function formatCell(value, width, type, coloredOutput) {
    var padding = width - strLength(value, coloredOutput);

    if (type === 'string') {
      return value + repeat(' ', padding);
    }

    return repeat(' ', padding) + value;
  }

  function strLength(value, coloredOutput) {
    var str = String(value);
    if (coloredOutput) {
      str = str.replace(/\u001b\[\d{1,2}m?/g, '');
    }
    return str.length;
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
