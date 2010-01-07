var file = require("file");

/**
 * Template loading and preprocessing.
 */
var TemplateManager = exports.TemplateManager = function(root) {
    this.root = root || exports.templatesRoot;
    this.Template = require(engine || "template").Template;
    this.cache = {};    
}

var include = function(path) {
    path = this.root + path; 
    if (file.exists(path)) {
          return file.read(path, "b").decodeToString("UTF-8");
    } else {
        return "";
    }    
}

var getParent = function(str) {
}

var applyIncludes = function(str) {
}

var extractBlocks = function(str) {
}
