// Public: A module that takes a buffer, detects the character set, and
// returns the decoded string.
//
// The Reader follows [ruv-it!’s algorithm](http://hitkey.nekokan.dyndns.info/cmds.htm#CHARSET)
// for detecting the character set.
//

var chardet = require('bemuse-chardet/bemuse-chardet')
var iconv = require('iconv-lite')

/**
 * Reads the buffer, detect the character set, and returns the decoded
 * string synchronously.
 * @param {Buffer} buffer
 * @returns {string} the decoded text
 */
export function read (buffer) {
  var charset = chardet.detect(buffer)
  var text = iconv.decode(buffer, charset)
  if (text.charCodeAt(0) === 0xfeff) {
    // BOM?!
    return text.substr(1)
  } else {
    return text
  }
}

/**
 * Like `read(buffer)`, but this is the asynchronous version.
 * @param {Buffer} buffer
 * @param {(error: Error | null, value?: string) => any} callback
 */
export function readAsync (buffer, callback) {
  setTimeout(function () {
    var result
    try {
      result = { value: exports.read(buffer) }
    } catch (e) {
      result = { error: e }
    }
    if (result.error) {
      callback(result.error)
    } else {
      callback(null, result.value)
    }
  })
}
