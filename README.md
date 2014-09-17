# es6-ember-template-compiler-brunch

A Brunch plugin for compiling Ember handlebars templates to ES6 modules which are then transpiled to javascript.  This performs an equivalent pipeline to Ember-CLI and uses the same ember-template-compiler and es6-module-transpiler.

This plugin leverages my other plugin [es6-module-transpiler-js-brunch](https://github.com/ahacking/es6-module-transpiler-js-brunch) to provide transpiling of the resulting ES6 Javascript. It is necessary to leverage plugins this way as the es6-transpiler currently does not allow more than one node module to require it. :(

# Motivation
I am currently using this plugin to provide ember-cli equivalent ES6 module transpiling for handlebars templates but using brunch instead of ember-cli/broccoli because performance regressions (as at 14 Sep 2014) render it unusable.

This plugin was influenced by ember-template-compiler-brunch but intended to be 100% compatible with what Ember-CLI generates (AMD based modules).

## Usage
Install the plugin via npm with `npm install --save es6-ember-template-compiler-brunch`.

Or, do manual install:

* Add `"es6-ember-template-compiler-brunch": "x.y.z"` to `package.json` of your brunch app.
* If you want to use git version of plugin, add
`"es6-ember-template-compiler-brunch": "git+ssh://git@github.com:ahacking/es6-ember-template-compiler-brunch.git"`.

## Configuration

The plugin has the following settings:

* **precompile**: Whether or not templates should be precompiled, default is **true**.
* **wrapper**: Specifies the module wrapper, eg 'amd' (default) or cjs'.
* **moduleName**: A function for mapping module names. This is useful for stripping off the 'app/' prefix and replacing with an application namespace as shown below so that template names are compatible with the new ember-resolver (as used in ember-cli).

**It is important to disable the brunch module wrapper when using AMD as it interferes with the module wrapping performed by this plugin.**

```coffeescript
exports.config = 
  modules:
    wrapper: false
  templates:
    joinTo: 'app.js'
    moduleName: (path)-> path.replace /^app/', appName
```
