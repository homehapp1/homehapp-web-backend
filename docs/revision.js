'use strict';

var semver = require('semver');
var fs = require('fs');
var glob = require("glob")

const SOURCE_PATH = 'server';

if (!process.argv[2] || !semver.valid(process.argv[2])) {
  console.error('Usage: node revision.js version');
  process.exit(1);
}

var version = process.argv[2];

// options is optional
glob(SOURCE_PATH + "/routes/api/*.js", function (err, files) {
  var maxVersion = '0.0.1';

  var blocks = files.map(function(filename) {
    var code = fs.readFileSync(filename, 'utf8');
    var regexp = /(\/\*(.|\n)+?\*\/)/g;
    var tmp = [];
    var match, v, blockVersion;

    // Get all the @api documentation blocks
    while (match = regexp.exec(code)) {
      if (!match[1].match(/@api/)) {
        continue;
      }
      tmp.push(match[1]);

      if (v = match[1].match(/@apiVersion\s+([0-9\.\-a-z]+)/g)) {
        blockVersion = v[0].replace(/@apiVersion\s+/, '');

        if (semver.gt(blockVersion, maxVersion)) {
          maxVersion = blockVersion;
        }
      }
    }

    // Rewrite the new version to the code blocks
    code = code.replace(/@apiVersion\s+(.+)/g, '@apiVersion ' + version);
    fs.writeFileSync(filename, code);
    return tmp.join("\n");
  });
  // console.log(blocks.join("\n"));
  console.log(maxVersion);

  fs.writeFileSync(SOURCE_PATH + '/routes/api/documentation/v' + maxVersion + '.js', blocks.join("\n").replace(/[ ]+\*/g, ' *'));
});
