var assert = require("assert");

var TPP = require("../../lib/normal-template/tpp");

exports.testGetTemplatePath = function() {
    var src = "{#t /path/to/layout.html} this is a template {#def content}the content{/#def}";
    assert.equal("/path/to/layout.html", TPP.getTemplatePath(src));
    var src = "{#template /path/to/layout.html} this is a template {#def content}the content{/#def}";
    assert.equal("/path/to/layout.html", TPP.getTemplatePath(src));
}

exports.testExtractData = function() {
    var src = "{#template /path/to/layout.html} {#def header}the header{/#def} {#define content}the content{/#define}",
        data = TPP.extractData(src);
    assert.equal("the header", data.header);
    assert.equal("the content", data.content);
}

exports.testExpandIncludes = function() {
    var src = ">> {#include /path/to/fragment} <<";
    assert.equal(">> loaded: /path/to/fragment <<", TPP.expandIncludes(src, function(path) { return "loaded: " + path; }));
}
