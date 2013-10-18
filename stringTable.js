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
        rowSeparator      = options.rowSeparator,
        capitalizeHeaders = options.capitalizeHeaders || false,
        formatters        = options.formatters || {},
        typeFormatters    = options.typeFormatters || {},
        rows              = [createHeaderRow(headers, capitalizeHeaders)],
        formats           = [];

    for (var i = 0; i < records.length; ++i) {
      // Yes, this is getting completely out of hand.
      appendRowAndFormat(records[i], headers, formatters, typeFormatters, rows, formats);
    }

    var totalWidth =
      // Width of outer border on each side
      (strLength(outerBorder) * 2) +

      // There will be an inner border between each cell, hence 1 fewer than total # of cells
      (strLength(innerBorder) * (headers.length - 1)) +

      // Each cell is padded by an additional space on either side
      (headers.length * 2);

    var columnWidths = [];
    for (var i = 0; i < rows[0].length; ++i) {
      (function(columnIndex) {
        var columnWidth = getMaxWidth(rows, columnIndex);
        columnWidths.push(columnWidth);
        totalWidth += columnWidth;
      }(i));
    }

    var columnTypes = [];
    for (var i = 0; i < rows[0].length; ++i) {
      columnTypes.push(getColumnType(rows, i));
    }

    var formattedLines = [];
    for (var i = 0; i < rows.length; ++i) {
      (function(row, cellFormats) {
        // Determine the height of each row
        var rowHeight = getMaxHeight(row),
            currentLine;

        // Get the lines of each cell once, so we don't have to keep splitting
        // over and over in the loop after this one.
        var cellLines = [];
        for (var col = 0; col < row.length; ++col) {
          cellLines.push(String(row[col]).split('\n'));
        }

        // Print the row one line at a time (this requires revisiting each cell N times for N lines)
        for (var line = 0; line < rowHeight; ++line) {
          currentLine = [];

          for (var j = 0; j < row.length; ++j) {
            (function(cell, width, type, format) {
              var lines = cellLines[j];
              currentLine.push(formatCell(lines[line] || '', width, type, format));
            }(row[j], columnWidths[j], columnTypes[j], i > 0 && cellFormats[j]));
          }

          formattedLines.push(outerBorder + ' ' + currentLine.join(' ' + innerBorder + ' ') + ' ' + outerBorder);
        }

        if (rowSeparator && i > 0 && i < rows.length - 1) {
          formattedLines.push(createRowSeparator(totalWidth, rowSeparator));
        }

        // Add the header separator right after adding the header
        if (i === 0) {
          formattedLines.push(createRowSeparator(totalWidth, headerSeparator));
        }
      }(rows[i], formats[i - 1]));
    }

    return formattedLines.join('\n');
  }

  function appendRowAndFormat(data, headers, formatters, typeFormatters, rows, formats) {
    var row         = [],
        cellFormats = [];

    for (var i = 0; i < headers.length; ++i) {
      (function(header, columnIndex) {
        var value = data[header];

        var formatter = formatters[header] ||
          typeFormatters[typeof value] ||
          identity;

        var formatted = formatter(value, header);
        if (formatted && typeof formatted === 'object') {
          value = formatted.value;
          if (formatted.format && formatted.format.color) {
            value = value[formatted.format.color];
          }
          cellFormats.push(formatted.format);

        } else {
          value = formatted;
          cellFormats.push(null);
        }

        row.push(value);

      }(headers[i], i));
    }

    rows.push(row);
    formats.push(cellFormats);
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

  function createRowSeparator(totalWidth, separator) {
    return repeatToLength(separator, totalWidth);
  }

  function getMaxWidth(rows, columnIndex) {
    var maxWidth = 0,
        lines;
    for (var i = 0; i < rows.length; ++i) {
      lines = String(rows[i][columnIndex]).split('\n');
      for (var j = 0; j < lines.length; ++j) {
        maxWidth = Math.max(maxWidth, strLength(lines[j]));
      }
    }
    return maxWidth;
  }

  function getMaxHeight(row) {
    var maxHeight = 1;
    for (var i = 0; i < row.length; ++i) {
      maxHeight = Math.max(maxHeight, lineCount(String(row[i])));
    }
    return maxHeight;
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

  function formatCell(value, width, type, format) {
    var padding = width - strLength(value);

    var alignment = (format && format.alignment) ||
      (type === 'number' ? 'right' : 'left');

    switch (alignment) {
      case 'right':
        return padRight(value, padding);

      case 'left':
      default:
        return padLeft(value, padding);
    }
  }

  function strLength(value) {
    return String(value).replace(/\u001b\[\d{1,2}m?/g, '').length;
  }

  /**
   * @examples
   * countOccurrences('foo', 'f') => 1
   * countOccurrences('foo', 'o') => 2
   * countOccurrences('bar', 'z') => 0
   */
  function countOccurrences(str, char) {
    var count = 0,
        index = str.indexOf(char);

    while (index !== -1) {
      ++count;
      index = str.indexOf(char, index + char.length);
    }

    return count;
  }

  function lineCount(str) {
    return countOccurrences(str, '\n') + 1;
  }

  /**
   * @examples
   * padLeft('foo', 2) => 'foo  '
   * padLeft('foo', 0) => 'foo'
   */
  function padLeft(value, padding) {
    return value + repeat(' ', padding);
  }

  /**
   * @examples
   * padRight('foo', 2) => '  foo'
   * padRight('foo', 0) => 'foo'
   */
  function padRight(value, padding) {
    return repeat(' ', padding) + value;
  }

  /**
   * @examples
   * repeat('a', 3)   => 'aaa'
   * repeat('abc', 3) => 'abcabcabc'
   * repeat('a', 0)   => ''
   */
  function repeat(value, count) {
    return new Array(count + 1).join(value);
  }

  /**
   * @examples
   * repeatToLength('a', 3)   => 'aaa'
   * repeatToLength('foo', 7) => 'foofoof'
   */
  function repeatToLength(value, length) {
    if (length < value.length) {
      return value.substring(0, length);
    }

    var str = value;
    while ((str.length * 2) < length) {
      str += str;
    }

    str += str.substring(0, length - str.length);

    return str;
  }

  function identity(value) {
    return value;
  }

  var stringTable = {
    create: createTable,

    // These are useful for testing; why not expose them?
    utils: {
      padLeft: padLeft,
      padRight: padRight,
      repeat: repeat,
      repeatToLength: repeatToLength
    }
  };

  module.exports = module.stringTable = stringTable;

}(typeof module !== 'undefined' ? module : this));
