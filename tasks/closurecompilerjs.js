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

            var flags = this.options({
                angularPass: false,
                applyInputSourceMaps: false,
                assumeFunctionWrapper: false,
                checksOnly: false,
                compilationLevel: "ADVANCED"
            });

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
                grunt.file.write(el.dest, result.compiledCode);
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
