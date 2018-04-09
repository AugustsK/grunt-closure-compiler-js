'use strict';
var path = require('path');
var eachAsync = require('each-async');
var closureCompiler = require('google-closure-compiler-js');

debugger;

module.exports = function (grunt) {
    grunt.verbose.writeln('\n' + closureCompiler.info + '\n');

    grunt.registerMultiTask('closurecompilerjs', 'Compile JS with closure compiler', function () {
        eachAsync(this.files, function (el, i, next) {
            var src = el.src[0];

            if (!src || path.basename(src)[0] === '_') {
                next();
                return;
            }

            var flags = this.options({
                angularPass: false,
                applyInputSourceMaps: false,
                assumeFunctionWrapper: false,
                checksOnly: false,
                compilationLevel: "ADVANCED",
                warningLevel: "VERBOSE"
            });

            flags['jsCode'] = [{
                src:grunt.file.read(src),
                path:src
            }];

            var result = closureCompiler.compile(flags);

            if (result.errors.length > 0) {
                for (var i in result.errors) {
                    if (result.errors.hasOwnProperty(i)) {
                        console.error(result.errors[i]);
                    }
                }
            } else {
                grunt.file.write(el.dest, result.compiledCode);
            }

            if (result.warnings.length > 0) {
                for (var j in result.warnings) {
                    if (result.warnings.hasOwnProperty(j)) {
                        console.info(result.warnings[j]);
                    }
                }
            }

        }.bind(this), this.async());
    });
};
