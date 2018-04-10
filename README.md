# grunt-closure-compiler-js

> Compile individual JS files with Closure Compiler

This task uses [closure-compiler-js](https://github.com/google/closure-compiler-js) to compile individual files.

Unlike other implementations with Grunt, this task relies solely on JS version of Google Closure Compiler. Also, it does <b>NOT</b> produce single output file, but rather treats each JS file individually for applications, where concating all JS files is not an option.

## Install

```
$ npm install --save-dev grunt-closure-compiler-js
```

## Usage

```js
grunt.initConfig({
    closurecompilerjs: {
        options: {
            compilationLevel: "ADVANCED"
        },
        dist: {
            files: [
                {
                    cwd: 'src/js',
                    src: ['**/*.js'],
                    dest: 'static/js',
                    ext: '.min.js',
                    expand: true
                }
            ]
```

## Options

See the `closure-compiler-js` [flags](https://github.com/google/closure-compiler-js#flags), except for warningLevel and jsCode.

## License

MIT © [AugustsK](https://github.com/AugustsK)
