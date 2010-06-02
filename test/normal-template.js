var assert = require("assert");

var TEMPLATE = require("../lib/normal-template"),
    compile = TEMPLATE.compile;

exports.testInterpolation = function () {
    var t = compile("Hello {=name}, {=article/title} {=article/deep/value}");
    var data = {name: "George", article: {title: "News", content: "No news is good news", deep: {value: "found"}}};
    assert.equal("Hello George, News found", t(data));
}

exports.testComments = function () {
    var t = compile("Hello {:! this is a comment }Stella");
    var data = {};
    assert.equal("Hello Stella", t(data));
}

exports.testSelect = function () {
    var t = compile("Hello {:select user}{=name}, {=age}{/:select}");
    var data = {user: {name: "George", age: "34"}};
    assert.equal("Hello George, 34", t(data));
    
    t = compile("Hello {:s deep/user}{=name}, {=age}{/:s}");
    data = {deep: {user: {name: "Stella", age: "34"}}};
    assert.equal("Hello Stella, 34", t(data));
}

exports.testReduce = function () {
    var t = compile("{:r articles}{=title}: {=content} {/:r}");
    var data = {articles: [
        {title: "Hello1", content: "World1"},
        {title: "Hello2", content: "World2"},
        {title: "Hello3", content: "World3"}
    ]};
    assert.equal("Hello1: World1 Hello2: World2 Hello3: World3 ", t(data));

    t = compile("test {:r articles}{=title}: {=content} {/:r}");
    data = {articles: []};
    assert.equal("test ", t(data));

    t = compile("test {:r articles}{=title}: {=content} {/:r}");
    data = {};
    assert.equal("test ", t(data));
}

exports.testCurly = function () {
    var t = compile("Hello {=name}, function () { var a = 1 + 2 }");
    var data = {name: "George"};
    assert.equal("Hello George, function () { var a = 1 + 2 }", t(data));
}

exports.testIfElse = function () {
    var t = compile("{:if cool}cool {=outer}{:e}not cool{/:if}");
    var data = {};
    assert.equal("not cool", t(data));
    var data = {cool: "ok", outer: "this is outer"};
    assert.equal("cool this is outer", t(data));
}

exports.testSelectElse = function () {
    var t = compile("{:s cool}cool{:e}not cool{/:s}");
    var data = {};
    assert.equal("not cool", t(data));
}

exports.testInterpolateNone = function () {
    var t = compile("Hello {=value}");
    var data = {};
    assert.equal("Hello ", t(data));    
}

exports.testInterpolateNone = function () {
    var t = compile("Hello {=value}");
    var data = {value: 0};
    assert.equal("Hello 0", t(data));    
}

exports.testDot = function () {
    var t = compile("{:s cool}{=.}{:e}not cool{/:s}");
    var data = {cool: 34};
    assert.equal("34", t(data));
}

exports.testReduceElse = function () {
    var t = compile('{:r articles}<li>{=title}: {=content}</li>{:e}no articles{/:r}');
    var data = {articles: [
        {title: "Hello1", content: "World1"},
        {title: "Hello2", content: "World2"},
        {title: "Hello3", content: "World3"}
    ]};
    assert.equal("<li>Hello1: World1</li><li>Hello2: World2</li><li>Hello3: World3</li>", t(data));

    var data = {};
    assert.equal("no articles", t(data));

    var data = {articles: []};
    assert.equal("no articles", t(data));
}

// stupid, but lets test this.
exports.testSelectReduceElse = function () {
    var t = compile("{:s articles}{:r .}<li>{=title}: {=content}</li>{/:r}{:e}no articles{/:s}");
    var data = {articles: [
        {title: "Hello1", content: "World1"},
        {title: "Hello2", content: "World2"},
        {title: "Hello3", content: "World3"}
    ]};
    assert.equal("<li>Hello1: World1</li><li>Hello2: World2</li><li>Hello3: World3</li>", t(data));

    var data = {};
    assert.equal("no articles", t(data));
}

exports.testDefaultFilter = function () {
    var t = compile("{=name}", {filters: {defaultfilter: TEMPLATE.filters.html}});
    var data = {name: "George >> 2"};
    assert.equal("George &gt;&gt; 2", t(data));
}

exports.testCustomFilters = function () {
    var t = compile("{=upcase name}", {filters: {
        upcase: function (val) {
            return val.toString().toUpperCase();
        }
    }});
    var data = {name: "George"};
    assert.equal("GEORGE", t(data));
}

exports.testMultipleFilters = function () {
    var t = compile("{=lispy upcase name}", {filters: {
        upcase: function (val) {
            return val.toString().toUpperCase();
        },
        lispy: function (val) {
            return "((" + val + "))";
        }
    }});
    var data = {name: "George"};
    assert.equal("((GEORGE))", t(data));
}

exports.testNewlinesEscaping = function () {
    var t = compile("hello\n {=name}\nworld\n");
    var data = {name: "George"};
    assert.equal("hello\n George\nworld\n", t(data));
}

exports.testQuotesEscaping = function () {
    var t = compile('hello "{=name}", how "are" you?');
    var data = {name: "George"};
    assert.equal('hello "George", how "are" you?', t(data));
}

exports.testCurlyBrackets = function () {
    var t = compile('enclose in {:lb}brackets{:rb}');
    var data = {};
    assert.equal('enclose in {brackets}', t(data));
}

exports.testSyntaxErrors = function () {
    try {
        compile("{/:s articles}articles")
    } catch (e) {
        var err = "Unbalanced 'select' close tag";
        assert.ok(e.toString().match(new RegExp(err)), err);
    }

    try {
        compile("{:if user}{:s articles}articles{/:if}")    
    } catch (e) {
        var err = "Unbalanced 'if' close tag, expecting 'select'";
        assert.ok(e.toString().match(new RegExp(err)), err);
    }
    
    try {
        compile("{:if user}{:s articles}articles")    
    } catch (e) {
        var err = "Unbalanced 'select' tag, is not closed";
        assert.ok(e.toString().match(new RegExp(err)), err);
    }    
}

exports.testIfBoolean = function () {
    var t = compile("{:if bool}true{:e}not true{/:if}");
    var data = {bool: false};
    assert.equal("not true", t(data));
}

exports.testInterpolationEscaping = function () {
    try {
        compile("hello {=name|test}")    
    } catch (e) {
        var err = "Invalid characters in path 'name|test'";
        assert.ok(e.toString().match(new RegExp(err)), err);
    }    
    
    try {
        compile("hello {=name;test}")    
    } catch (e) {
        var err = "Invalid characters in path 'name;test'";
        assert.ok(e.toString().match(new RegExp(err)), err);
    }    
}

exports.testBackslashEscaping = function () {
    var t = compile("if (/\\/fora\\/topics/.test(e.target.href)) {");
    var data = {};
    assert.equal("if (/\\/fora\\/topics/.test(e.target.href)) {", t(data));
}

exports.testReduceSelectInterpolate = function () {
    var t = compile("{:r articles}{=title} {:s forum}{=title}{/:s} {=count}{/:r}");
    var data = {
        articles: [
            {title: "Hello1", count: 1, forum: { title: "Forum1" }},
            {title: "Hello2", count: 2, forum: { title: "Forum2" }}            
        ]
    };
    assert.equal("Hello1 Forum1 1Hello2 Forum2 2", t(data));
}

exports.testNestedBrackets = function () {
    var t = compile("{instance: {=singular}}");
    var data = {
        singular: "article"
    };
    assert.equal("{instance: article}", t(data));
}
