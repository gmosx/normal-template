var TOKEN_RE = new RegExp("(\{.+?\}\}?)"),
	COMMAND_RE = new RegExp("^\{[\:\=]");

var xpath = function(path) {
    path = path.replace(/\//g, ".");
    if (/^\./.test(path)) {
        return "data" + path;
    } else {
        return "d." + path;
    }
}

var FILTERS = {
    html: function(val) {
        return val.replace(/&/g, "&amp;").replace(/>/g, "&gt;").
                   replace(/</g, "&lt;");
    },
    attr: function(val) {
        return val.replace(/&/g, "&amp;").replace(/>/g, "&gt;").
                   replace(/</g, "&lt;").replace(/"/g, "&quot;");
    },
    uri: encodeURI
}

/**
 * Compile the template source into the template function.
 */
exports.compile = function(src, filters) {
    var code = ['var v,d = data,df = filters.html,res = [];'],
        stack = ["data"];
        tokens = src.split(TOKEN_RE);
print(JSON.stringify(tokens))
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (token.match(COMMAND_RE)) {
            if (token[1] == ":") { // statement
                token = token.substring(2, token.length-1);
                var parts = token.split(" "),
                    cmd = parts[0],
                    arg = parts[1];
              
                switch (cmd) {
                case "end":
                case "e":
                    stack.shift();
                    code.push('};d = ' + stack[0] + ';');
                    continue;
                    
                case "with":
                case "if":
                case "w":
                    var val = xpath(arg);
                    code.push('if (d = ' + val + ') {');
                    stack.unshift(val.replace(/^d\./, stack[0] + "."));
                    continue;                    
                
                case "loop":
                case "l":
                    var val = xpath(arg);
                    code.push('if (' + val + ') ');
                    stack.unshift(val.replace(/^d\./, stack[0] + "."));
                    code.push('for (var i = 0, l = ' + val + '.length; i < l; i++) {d = ' + val + '[i];');                
                    continue;                    
                    
                case "or":
                    code.push('} else {');
                    continue;

                case "c": // comment
                case "#":
                    continue;
                }
            } else if (token[1] == "=") { // interpolation
                var parts = token.substring(2, token.length-1).split(" ");
                    pre = "", post = "";
                for (var j = 0; j < parts.length-1; j++) {
                    pre += "filters." + parts[j] + "("; post += ")";
                }
                if (pre == "") {
                    pre = "df("; post = ")";
                }
                code.push('if (v = ' + xpath(parts[j]) + ') res.push(' + pre + 'v' + post +');');
                continue;
            }
        }

        // plain text
        if (token != "") code.push('res.push("' + token.replace(/\n/, "\\n") + '");');
    }    

    code.push('return res.join("");');    

    print(code.join(""));    
    
    var func = new Function("data", "filters", code.join(""));

    return function(data) { return func(data, (filters || FILTERS)) };
}

/*
{:# this is a comment }
hello {user} of level (user/level)

{:w admin}this is {.}{:e}
{:w users}
    {:w /admin} {name}: admin{:e} 
{:or}

{:e users}

{:with user}
    {name} {age}
{:or}
    no user
{:end user}

{:with user}
    {{name}} {{html age}}
    {{include /path/to/fragment}}
{:or}
    no user
{:end user}


+ faster (compile to function)
+ {{..}} is safer
+ path can access ancestors
+ escape by default.
+ multiple filters.
- include as filter. 
- handle functions? no...
*/

var TEMPLATE = exports,
    template = TEMPLATE.compile("\
{:# this is a comment }\
hello {=user}!!\n\
great article: {=article/title} = {=article/content} and {:w article}{=/user} ~ {=uri html title}={=content}{:e}\n\
  empty: {:if cool}cool{:or}not cool{:e cool} / {=cool}\n\
"),
    data = {user: "ge << orge", article: {title: "hello", content: "world"}, posts: [
        {title: "mega", content: "cool"},
        {title: "very", content: "nice"}
    ]};
print();    
print(template(data));

