/**
 * Normal Template Pre Processor.
 *
 * Performs static pre processing of templates:
 * - static fragment inclusion.
 * - static expansion of 'meta' templates (template of templates).
 */

var TEMPLATE_RE = /\{\#(template|t) (.*?)\}/;

/**
 * Define the 'meta' template.
 * Example:
 *   {#template /path/to/layout.html}
 */
exports.getTemplatePath = function(str) {
    var match = str.match(TEMPLATE_RE);
    if (match) {        
        return match[2];
    } else {
        return false;
    }
}

var INCLUDE_RE = /\{#include (.*?)\}/g;

/**
 * (Recursively) Expand include directives.
 * Example:
 *   {#include /path/to/fragment}
 */
exports.expandIncludes = function(str, load) {
    while (INCLUDE_RE.test(str)) {
        str =  str.replace(INCLUDE_RE, function(match, path) {
            return load(path) || "error: cannot include '" + path + "'";        
        });
    }
    
    return str;
}

var BLOCK_RE = /\{\#(def|define|d) (.*?)\}([\s\S]*?)\{\/\#(def|define|d)(.*?)\}/g;

/**
 * Extract data to be interpolated in the parent template.
 * Example:
 *   {#def content}
 *   ..
 *   {/#def}
 */
exports.extractData = function(str) {
    var data = {};
    
    var str = str.replace(BLOCK_RE, function(match, tag, key, value) {
        data[key] = value;
    });
    
    return data;
}
