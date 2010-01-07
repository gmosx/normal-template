var assert = require("test/assert");

var compile = require("../lib/normal-template").compile;

exports.testInterpolation = function() {
    var t = compile("Hello {=name}, {=article/title} {=article/deep/value}");
    var data = {name: "George", article: {title: "News", content: "No news is good news", deep: {value: "found"}}};
    assert.isEqual("Hello George, News found", t(data));
}

exports.testComments = function() {
    var t = compile("Hello {## this is a comment }Stella");
    var data = {};
    assert.isEqual("Hello Stella", t(data));
}

exports.testWith = function() {
    var t = compile("Hello {#with user}{=name}, {=age}{/with}");
    var data = {user: {name: "George", age: "34"}};
    assert.isEqual("Hello George, 34", t(data));
    
    t = compile("Hello {#w deep/user}{=name}, {=age}{/w}");
    data = {deep: {user: {name: "Stella", age: "34"}}};
    assert.isEqual("Hello Stella, 34", t(data));
}

exports.testReduce = function() {
    var t = compile("{#r articles}{=title}: {=content} {/r}");
    var data = {articles: [
        {title: "Hello1", content: "World1"},
        {title: "Hello2", content: "World2"},
        {title: "Hello3", content: "World3"}
    ]};
    assert.isEqual("Hello1: World1 Hello2: World2 Hello3: World3 ", t(data));

    t = compile("test {#r articles}{=title}: {=content} {/r}");
    data = {articles: []};
    assert.isEqual("test ", t(data));

    t = compile("test {#r articles}{=title}: {=content} {/r}");
    data = {};
    assert.isEqual("test ", t(data));
}

exports.testCurly = function() {
    var t = compile("Hello {=name}, function() { var a = 1 + 2 }");
    var data = {name: "George"};
    assert.isEqual("Hello George, function() { var a = 1 + 2 }", t(data));
}

exports.testIfElse = function() {
    var t = compile("{#if cool}cool{#e}not cool{/if}");
    var data = {};
    assert.isEqual("not cool", t(data));
    var data = {cool: "ok"};
    assert.isEqual("cool", t(data));
}

exports.testWithOr = function() {
    var t = compile("{#with cool}cool{#or}not cool{/with}");
    var data = {};
    assert.isEqual("not cool", t(data));
}

exports.testInterpolateNone = function() {
    var t = compile("Hello {=value}");
    var data = {};
    assert.isEqual("Hello ", t(data));    
}

exports.testInterpolateNone = function() {
    var t = compile("Hello {=value}");
    var data = {value: 0};
    assert.isEqual("Hello 0", t(data));    
}

exports.testDot = function() {
    var t = compile("{#with cool}{=.}{#or}not cool{/with}");
    var data = {cool: 34};
    assert.isEqual("34", t(data));
}

exports.testReduceOr = function() {
    var t = compile('{#r articles}<li>{=title}: {=content}</li>{#or}no articles{/r}');
    var data = {articles: [
        {title: "Hello1", content: "World1"},
        {title: "Hello2", content: "World2"},
        {title: "Hello3", content: "World3"}
    ]};
    assert.isEqual("<li>Hello1: World1</li><li>Hello2: World2</li><li>Hello3: World3</li>", t(data));

    var data = {};
    assert.isEqual("no articles", t(data));

    var data = {articles: []};
    assert.isEqual("no articles", t(data));
}

// stupid, but lets test this.
exports.testWithReduceOr = function() {
    var t = compile("{#w articles}{#r .}<li>{=title}: {=content}</li>{/r}{#or}no articles{/w}");
    var data = {articles: [
        {title: "Hello1", content: "World1"},
        {title: "Hello2", content: "World2"},
        {title: "Hello3", content: "World3"}
    ]};
    assert.isEqual("<li>Hello1: World1</li><li>Hello2: World2</li><li>Hello3: World3</li>", t(data));

    var data = {};
    assert.isEqual("no articles", t(data));
}

exports.testDefaultFilter = function() {
    var t = compile("{=name}");
    var data = {name: "George >> 2"};
    assert.isEqual("George &gt;&gt; 2", t(data));
}

exports.testCustomFilters = function() {
    var t = compile("{=upcase name}", {filters: {
        upcase: function(val) {
            return val.toString().toUpperCase();
        }
    }});
    var data = {name: "George"};
    assert.isEqual("GEORGE", t(data));
}

exports.testMultipleFilters = function() {
    var t = compile("{=lispy upcase name}", {filters: {
        upcase: function(val) {
            return val.toString().toUpperCase();
        },
        lispy: function(val) {
            return "((" + val + "))";
        }
    }});
    var data = {name: "George"};
    assert.isEqual("((GEORGE))", t(data));
}

/*
exports.testIgnoreNumericInterpolator = function() {
    var t = new Template("Hello {0} {name}!");
    var data = { name: "George" };
    assert.isEqual("Hello {0} George!", t.render(data));
}

exports.testBrokenInterpolator = function() {
    var t = new Template("Hello {name is broken} {name}!");
    var data = { name: "George" };
    assert.isEqual("Hello {name is broken} George!", t.render(data));
}

exports.testUnescapeInterpolator = function() { 
    var t = new Template("Hello {name} {.meta-left}escape{.meta-right} {.meta-left}ok{.meta-right}");
    var data = { name: "George" };
    assert.isEqual("Hello George {escape} {ok}", t.render(data));
}

exports.testMultipleInterpolator = function() {
    var t = new Template("Hello {name} {name} {name}");
    var data = { name: "George" };
    assert.isEqual("Hello George George George", t.render(data));
}

exports.testFormatters = function() {
    var t = new Template("Hello {name|html}");
    var data = { name: "<George>" };
    assert.isEqual("Hello &lt;George&gt;", t.render(data));
}

exports.testCustomFormatters = function() {
    var t = new Template("Hello {name|html|upper}", {formatters: {
        "upper": function(val) { return val.toUpperCase(); }
    }});
    var data = { name: "<George>" };
    assert.isEqual("Hello &LT;GEORGE&GT;", t.render(data));
}

exports.testOps = function() {
    var t = new Template("Hello {.section user}{name}{.end}");
    var data = { user: { name: "George", age: 34} };
    assert.isEqual("Hello George", t.render(data));
}

exports.testDeepSection = function() {
    var t = new Template("Hello {.section user.name}{last}{.end}");
    var data = { 
        user: {
            name: {
                first: "George",
                last: "Moschovitis"
            },
            age: 34
        }
    };
    assert.isEqual("Hello Moschovitis", t.render(data));
}

exports.testDeepInterpolation = function() {
    var t = new Template("Hello {user.name.last}");
    var data = { 
        user: {
            name: {
                first: "George",
                last: "Moschovitis"
            },
            age: 34
        }
    };
    assert.isEqual("Hello Moschovitis", t.render(data));
}

exports.testRepeat = function() {
    var t = new Template("Hello {.repeated section users}<li>{name}</li>{.end}");
    var data = { users: [
        { name: "George", age: 34},
        { name: "Stella", age: 34}, 
        { name: "Renos", age: 33}, 
    ]};
    assert.isEqual("Hello <li>George</li><li>Stella</li><li>Renos</li>", t.render(data));
}

exports.testNoData = function() {
    var t = new Template("Hello {name}");
    var data = { age: 34 };
    assert.isEqual("Hello ", t.render(data));
}

exports.testNoDeepData = function() {
    var t = new Template("Hello {user.name}");
    var data = { age: 34 };
    assert.isEqual("Hello ", t.render(data));
    var t = new Template("Hello {user.name}");
    var data = { user: { age: 34 } };
    assert.isEqual("Hello ", t.render(data));
}

exports.testJSONTemplateCompatibility = function() {
    var t = new Template("Hello {.section user}{name}{.end}");
    var data = { user: { name: "George" } };
    assert.isEqual("Hello George", t.render(data));
    
    t = new Template("Hello {.repeated section users}<li>{name}</li>{.end}");
    data = { users: [
        { name: "George", age: 34},
        { name: "Stella", age: 34}, 
        { name: "Renos", age: 33}, 
    ]};
    assert.isEqual("Hello <li>George</li><li>Stella</li><li>Renos</li>", t.render(data));    
}

exports.testSectionCursor = function() {
    var t = new Template("Hello {.section users}{.repeated section @}<li>{name}</li>{.end}{.or}none{.end}");
    var data = { users: [
        { name: "George", age: 34},
        { name: "Stella", age: 34}, 
        { name: "Renos", age: 33}, 
    ]};
    assert.isEqual("Hello <li>George</li><li>Stella</li><li>Renos</li>", t.render(data));    
}

exports.testMeta = function() {
    var t = new Template("Hello {.meta-left}George{.meta-right} {age}");
    var data = { age: 34 };
    assert.isEqual("Hello {George} 34", t.render(data));    
}

exports.testLiterals = function() {
    var t = new Template("Hello {.newline} {.space} {.tab} {age}");
    var data = { age: 34 };
    assert.isEqual("Hello \n   \t 34", t.render(data));    
}

exports.testZero = function() {
    var t = new Template("Hello {value}");
    var data = { value: 0 };
    assert.isEqual("Hello 0", t.render(data));    
}

exports.testStack = function() {
    var t = new Template("Hello {.section obj}{name}, {value}{.end}");
    var data = { value: 3, obj: { name: "george" } };
    assert.isEqual("Hello george, 3", t.render(data));    


    var t = new Template("Hello {.section obj}{name}, {.section value}yes{.end}{.end}");
    var data = { value: 3, obj: { name: "george" } };
    assert.isEqual("Hello george, yes", t.render(data));    

}*/
