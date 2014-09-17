var sysPath  = require('path');
var emberTemplateCompiler = require('ember-template-compiler');


function ES6EmberTemplateCompilerBrunch(config) {
    var templates = config && config.files && config.files.templates || {};

    if (templates.precompile === false) {
        this.precompile = false;
    }
    if (templates.wrapper != null) {
        this.wrapper = 'to' + templates.wrapper.toUpperCase();
    }
    if (templates.moduleName != null) {
        this.moduleName = templates.moduleName;
    }
}

ES6EmberTemplateCompilerBrunch.prototype.brunchPlugin = true;
ES6EmberTemplateCompilerBrunch.prototype.type = 'template';
ES6EmberTemplateCompilerBrunch.prototype.extension = 'hbs';
ES6EmberTemplateCompilerBrunch.prototype.precompile = true;
ES6EmberTemplateCompilerBrunch.prototype.wrapper = "toAMD";
ES6EmberTemplateCompilerBrunch.prototype.transpiler = require('es6-module-transpiler-js-brunch').prototype.transpiler;
ES6EmberTemplateCompilerBrunch.prototype.compile = function (data, path, callback) {
  var template, ext, name;

  // STEP 1: process template (either compile to a javascript function or convert to a JSON-safe string)
  try {
    var template;
    if (this.precompile === true) {
        var content = emberTemplateCompiler.precompile(data);
        template = "Ember.Handlebars.template(" + content + ");\n"
    } else {
        var content = JSON.stringify(data.toString());
        template = "Ember.Handlebars.compile(" + content + ");\n"
    }
  } catch (error) {
    return callback(error);
  }

  // clean up the template name
  ext = sysPath.extname(path);
  name = sysPath.join(sysPath.dirname(path), sysPath.basename(path, ext)).replace(/[\\]/g, '/');
  if (this.moduleName) name = this.moduleName(name);

  // STEP 2: generate appropriate wrapper
  if (this.wrapper) {
    template = "import Ember from 'ember';\nexport default " + template;
    try {
      template = new this.transpiler(template, name)[this.wrapper]();
    } catch (e) {
      return callback(e.toString());
    }
  } else {
    template = "Ember.TEMPLATES['" + name + "'] = " + template;
  }

  return callback(null, { data: template });
};

module.exports = ES6EmberTemplateCompilerBrunch;
