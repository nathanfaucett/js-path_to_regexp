var isArray = require("@nathanfaucett/is_array"),
    isBoolean = require("@nathanfaucett/is_boolean");


var rePartsMatcher = /\.\w+|\.\:\w+|\/+\w+|\/\:\w+({.+?})?|\:\w+({.+?})?|\(.+?\)/g,
    rePartMatcher = /\:?\w+|{.+?}/g,
    rePartReplacer = /[\(\)]|\{.+?\}/g;


module.exports = pathToRegExp;


function pathToRegExp(path, params, end) {
    var parts = (path + "").match(rePartsMatcher) || [],
        i = -1,
        length = parts.length - 1,
        pattern, part, subParts, subRegexp, regexp;

    if (isArray(params)) {
        end = !!end;
        params.length = 0;
    } else if (isBoolean(params)) {
        end = params;
        params = [];
    } else {
        end = false;
        params = [];
    }

    pattern = "^";

    while (i++ < length) {
        part = parts[i];

        if (part.length !== 0) {
            if (part[0] === "(") {
                if (part[1] === "/" || part[1] === ".") {
                    pattern += "(?:\\" + part[1];
                }
                subParts = part.match(rePartMatcher);
                part = subParts[0];

                if (part[0] === ":") {
                    subRegexp = subParts[1];
                    subRegexp = subRegexp ? subRegexp.slice(1, -1) : "[a-zA-Z0-9-_]+";
                    pattern += "(" + subRegexp + "?)";
                    params[params.length] = new Param(part.slice(1), subRegexp, false);
                } else {
                    pattern += part;
                }

                pattern += ")?";
            } else {
                if (part[0] === "/" || part[0] === ".") {
                    pattern += "\\" + part[0] + "+";
                }
                subParts = part.match(rePartMatcher);
                part = subParts[0];

                if (part[0] === ":") {
                    subRegexp = subParts[1];
                    subRegexp = subRegexp ? subRegexp.slice(1, -1) : "[a-zA-Z0-9-_]+";
                    pattern += "(" + subRegexp + ")";
                    params[params.length] = new Param(part.slice(1), subRegexp, true);
                } else {
                    pattern += part;
                }
            }
        }
    }

    if (end === true) {
        pattern += "\\/?$";
    } else {
        pattern += "(?=\\/|$)";
    }

    regexp = new RegExp(pattern, "i");
    regexp.params = params;

    return regexp;
}

pathToRegExp.format = function(path) {
    var parts = path.match(rePartsMatcher) || [],
        i = -1,
        length = parts.length - 1,
        fmt = "",
        part;

    while (i++ < length) {
        part = parts[i];

        if (part) {
            if (part[0] !== "(") {
                part = part.replace(rePartReplacer, "");

                if (part.charAt(1) === ":") {
                    fmt += part.charAt(0) + "%s";
                } else if (part.charAt(0) === ":") {
                    fmt += "%s";
                } else {
                    fmt += part;
                }
            }
        }
    }

    return fmt || "/";
};

pathToRegExp.Param = Param;

function Param(name, regexp, required) {
    this.name = name;
    this.regexp = regexp;
    this.required = required;
}

Param.prototype.toJSON = function(json) {
    json = json || {};

    json.name = this.name;
    json.regexp = this.regexp;
    json.required = this.required;

    return json;
};
