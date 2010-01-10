/**
 * Normal Template
 */

var TOKEN_RE = new RegExp("(\{.+?\}\}?)"),
	COMMAND_RE = new RegExp("^\{[\:\/\=]");

var xpath = function(path) {
    path = path.replace(/\//g, ".");

    if (path == ".") {
        return "d";
    } else if (/^\./.test(path)) {
        return "data" + path;
    } else {
        return "d." + path;
    }
}

exports.filters = {
    str: function(val) { // used to override default filtering.
        return val.toString();
    },
    html: function(val) {
        return val.toString().replace(/&/g, "&amp;").replace(/>/g, "&gt;").
                   replace(/</g, "&lt;");
    },
    attr: function(val) {
        return val.toString().replace(/&/g, "&amp;").replace(/>/g, "&gt;").
                   replace(/</g, "&lt;").replace(/"/g, "&quot;");
    },
    uri: encodeURI
}

/**
 * Compile the template source into the template function.
 */
exports.compile = function(src, options) {
    // v = curent value, d = cursor, a = reduced array, df = default filter, res = result
    var code = ['var v,a,d = data,res = [];'],
        stack = ["data"],
        tokens = src.split(TOKEN_RE);

    var filters;

    if (options && options.filters) {
        filters = {};
        for (var i in exports.filters) filters[i] = exports.filters[i];
        for (var i in options.filters) filters[i] = options.filters[i];
    } else {
        filters = exports.filters;
    }

    if (filters.defaultfilter) {
        code.push('var df = filters.defaultfilter;');
    }
               
//print(JSON.stringify(tokens));
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        
        if (token == "") continue;

        if (token.match(COMMAND_RE)) {
            if (token[1] == ":") { // open tag
                var parts = token.substring(2, token.length-1).split(" "),
                    cmd = parts[0],
                    arg = parts[1],
                    val;
              
                switch (cmd) {
                case "if":
                    val = xpath(arg);
                    code.push('if (' + val + ' != undefined) {');
                    continue;                    

                case "with":
                case "w":
                    val = xpath(arg);
                    code.push('d = ' + val + ';if (d != undefined) {');
                    stack.unshift(val.replace(/^d\./, stack[0] + "."));
                    continue;                    
                
                case "reduce":
                case "r":
                    val = xpath(arg);
                    var depth = stack.length;
                    code.push('var a' + depth + ' = ' + val + ';if ((a' + depth + ' != undefined) && (a' + depth + '.length > 0)) ');
                    stack.unshift(val.replace(/^d\./, stack[0] + "."));
                    code.push('for (var i' + depth + ' = 0,l' + depth + ' = a' + depth + '.length; i' + depth + ' < l' + depth + '; i' + depth + '++) {d = a' + depth + '[i' + depth + '];');                
                    continue;                    
                    
                case "or":
                case "else":
                case "e":
                    code.push('} else {');
                    continue;

                case "lcb": // output left curly bracket '{'
                    code.push('res.push("{");');
                    continue;

                case "rcb": // output right curly bracket '}'
                    code.push('res.push("}");');
                    continue;

                case "c": // comment
                case "!":
                    continue;
                }
            } else if (token[1] == "/") { // close tag
                if (token[2] == ":") {
                    var cmd = token.substring(3, token.length-1).split(" ")[0];
                  
                    switch (cmd) {
                    case "if":
                        code.push('};');
                        continue;

                    case "with":
                    case "w":
                        stack.shift();
                        code.push('};d = ' + stack[0] + ';');
                        continue;

                    case "reduce":
                    case "r":
                        var depth = stack.length;
                        stack.shift();
                        code.push('};d = ' + stack[0] + ';');
                        continue;
                    }
                }
            } else if (token[1] == "=") { // interpolation
                var parts = token.substring(2, token.length-1).split(" "),
                    pre = "", post = "";
                for (var j = 0; j < parts.length-1; j++) {
                    pre += "filters." + parts[j] + "("; post += ")";
                }
                if (pre == "") {
                    if (filters.defaultfilter) {
                        pre = "df("; post = ")";
                    }
                }
                code.push('v = ' + xpath(parts[j]) + ';if (v != undefined) res.push(' + pre + 'v' + post +');');
                continue;
            }
        }

        // plain text
        code.push('res.push("' + token.replace(/\n/g, "\\n").replace(/"/g, '\\"') + '");');
    }    

    code.push('return res.join("");');    

//    print(code.join(""));    
    
    var func = new Function("data", "filters", code.join(""));

    return function(data) { return func(data, filters) };
}

/*
+ faster (compile to function)
+ {=..} is safer
+ path can access ancestors
+ escape by default.
+ multiple filters.
+ reduce
- many templates in one file.
! include as filter -> NO
- handle functions? no...
*/
