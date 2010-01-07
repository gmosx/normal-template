/**
 * Normal Template Pre Processor.
 *
 * Performs static pre processing of templates:
 * - static fragment inclusion.
 * - static expansion of 'super' templates (template of templates).
 */

var TEMPLATE_RE = /\{\#(template|t) (.*?)\}/;

/**
 * Define the 'super' template.
 * Example:
 *   {#template /path/to/layout.html}
 */
exports.getTemplate = function(str) {
    var match = str.match(TEMPLATE_RE);
    if (match) {        
        return match[2];
    } else {
        return false;
    }
}

var INCLUDE_RE = /\{#include (.*?)\}/g;

/**
 * Expand include directives.
 * Example:
 *   {#include /path/to/fragment}
 */
exports.expandIncludes = function(str, load) {
    return str.replace(INCLUDE_RE, function(match, path) {
        return load(path) || "error: '" + path + "' not found!";        
    });
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
