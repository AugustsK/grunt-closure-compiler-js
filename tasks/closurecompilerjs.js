'use strict';
var path = require('path');
var eachAsync = require('each-async');
var closureCompiler = require('google-closure-compiler-js');

module.exports = function (grunt) {
    grunt.verbose.writeln('\n' + closureCompiler.info + '\n');

    var printErrors = function (severity, obj) {
        var msg = obj.type + ' in ' + path.resolve(obj.file) + ' at ' + obj.lineNo + ':' + obj.charNo + '\n' + obj.description;

        if (severity === 1) {
            grunt.log.error(msg);
        } else {
            grunt.log.writeln(msg);
        }
    }

    grunt.registerMultiTask('closurecompilerjs', 'Compile JS with closure compiler', function () {
        eachAsync(this.files, function (el, i, next) {
            var src = el.src[0];

            if (!src || path.basename(src)[0] === '_') {
                next();
                return;
            }

            var flags = this.options();

            flags['jsCode'] = [{
                src:grunt.file.read(src),
                path:src
            }];

            flags['warningLevel'] = "VERBOSE";

            var result = closureCompiler.compile(flags);

            if (result.errors.length > 0) {
                for (var i in result.errors) {
                    if (result.errors.hasOwnProperty(i)) {
                        printErrors(1, result.errors[i]);
                    }
                }
            } else {
              var jsCode = result.compiledCode;

              if (result.sourceMap) {
                  var sourceMapDest = el.dest + '.map',
                      sourceMapFilename = path.basename(el.dest) + '.map',
                      sourceMap = JSON.parse(result.sourceMap);

                  if (sourceMap.sources && sourceMap.sources.length > 0) {
                      for (var i = 0; i < sourceMap.sources.length; i++) {
                          var sourcePath = path.relative(
                              path.resolve(path.dirname(el.dest)),
                              path.resolve(sourceMap.sources[i])
                          );

                          sourceMap.sources[i] = sourcePath;
                      }
                  }

                  sourceMap.file = path.basename(el.dest);

                  jsCode = jsCode + '\r\n//# sourceMappingURL=' + sourceMapFilename;

                  grunt.file.write(sourceMapDest, JSON.stringify(sourceMap));
              }

              grunt.file.write(el.dest, jsCode);
            }

            if (result.warnings.length > 0) {
                for (var j in result.warnings) {
                    if (result.warnings.hasOwnProperty(j)) {
                        printErrors(0, result.warnings[j]);
                    }
                }
            }

            next();
        }.bind(this), this.async());
    });
};
