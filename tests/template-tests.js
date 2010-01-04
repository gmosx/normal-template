var assert = require("test/assert");

var compile = require("../lib/template").compile;

exports.testInterpolation = function() {
    var t = compile("Hello {=name}, {=article/title} {=article/deep/value}");
    var data = {name: "George", article: {title: "News", content: "No news is good news", deep: {value: "found"}}};
    assert.isEqual("Hello George, News found", t(data));
}

exports.testComments = function() {
    var t = compile("Hello {:# this is a comment } Stella");
    var data = {};
    assert.isEqual("Hello  Stella", t(data));
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
