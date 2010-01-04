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
    var code = ['var v,a,d = data,df = filters.html,res = [];'],
        stack = ["data"],
        tokens = src.split(TOKEN_RE);

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        
        if (token == "") continue;

        if (token.match(COMMAND_RE)) {
            if (token[1] == ":") { // statement
                token = token.substring(2, token.length-1);
                var parts = token.split(" "),
                    cmd = parts[0],
                    arg = parts[1],
                    val;
              
                switch (cmd) {
                case "end":
                case "e":
                    stack.shift();
                    code.push('};d = ' + stack[0] + ';');
                    continue;
                    
                case "with":
                case "if":
                case "w":
                    val = xpath(arg);
                    code.push('if (d = ' + val + ') {');
                    stack.unshift(val.replace(/^d\./, stack[0] + "."));
                    continue;                    
                
                case "reduce":
                case "r":
                    val = xpath(arg);
                    var depth = stack.length;
                    code.push('if (' + val + ') ');
                    stack.unshift(val.replace(/^d\./, stack[0] + "."));
                    code.push('var a' + depth + ' = ' + val + ';for (var i' + depth + ' = 0, l' + depth + ' = a' + depth + '.length; i' + depth + ' < l' + depth + '; i' + depth + '++) {d = a' + depth + '[i' + depth + '];');                
                    continue;                    
                    
                case "or":
                case "else":
                    code.push('} else {');
                    continue;

                case "c": // comment
                case "#":
                    continue;
                }
            } else if (token[1] == "=") { // interpolation
                var parts = token.substring(2, token.length-1).split(" "),
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
        code.push('res.push("' + token.replace(/\n/, "\\n") + '");');
    }    

    code.push('return res.join("");');    

//    print(code.join(""));    
    
    var func = new Function("data", "filters", code.join(""));

    return function(data) { return func(data, (filters || FILTERS)) };
}

/*
+ faster (compile to function)
+ {{..}} is safer
+ path can access ancestors
+ escape by default.
+ multiple filters.
+ reduce
- many templates in one file.
- include as filter. 
- handle functions? no...
*/
/*
var TEMPLATE = exports,
    template = TEMPLATE.compile("\
{:# this is a comment }\
hello {=user}!!\n\
great article: {=article/title} = {=article/content} and {:w article}{=/user} ~ {=uri html title}={=content}{:e}\n\
  empty: {:if cool}cool{:or}not cool{:e} / {=cool}\n\
{:r posts}{=title}:{=content} {:e}"),
    data = {user: "ge << orge", article: {title: "hello", content: "world"}, posts: [
        {title: "mega", content: "cool"},
        {title: "very", content: "nice"}
    ]};
print("");    
print(template(data));
*/
