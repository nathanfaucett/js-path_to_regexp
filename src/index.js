var rePartsMatcher = /\.\w+|\.\:\w+|\/+\w+|\/\:\w+(\[.+?\])?|\:\w+(\[.+?\])?|\(.+?\)/g,
    rePartMatcher = /\:?\w+|\[.+?\]/g,
    rePartReplacer = /[\(\)]|\[.+?\]/g;


module.exports = pathToRegexp;


function pathToRegexp(path, params, end) {
    var parts = path.match(rePartsMatcher) || [],
        i = -1,
        length = parts.length - 1,
        pattern, part, subParts, regexp;

    params && (params.length = 0);
    pattern = "^";

    while (i++ < length) {
        part = parts[i];
        if (part.length === 0) continue;

        if (part[0] === "(") {
            if (part[1] === "/" || part[1] === ".") {
                pattern += "(?:\\" + part[1];
            }
            subParts = part.match(rePartMatcher);
            part = subParts[0];

            if (part[0] === ":") {
                regexp = subParts[1] || "[a-zA-Z0-9-_]";

                pattern += "(" + regexp + "+?)";
                params && params.push(new Param(part.slice(1), regexp, false));
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
                regexp = subParts[1] || "[a-zA-Z0-9-_]";

                pattern += "(" + regexp + "+)";
                params && params.push(new Param(part.slice(1), regexp, true));
            } else {
                pattern += part;
            }
        }
    }

    if (end === true) {
        pattern += "\\/?$";
    } else {
        pattern += "(?=\\/|$)";
    }

    return attachParams(new RegExp(pattern, "i"), params);
}

pathToRegexp.format = function(path) {
    var parts = path.match(rePartsMatcher) || [],
        i = -1,
        length = parts.length - 1,
        fmt = "",
        part, optional;

    while (i++ < length) {
        part = parts[i];
        if (!part) continue;

        optional = false;
        if (part[0] === "(") {
            optional = true;
        }

        part = part.replace(rePartReplacer, "");

        if (part[1] === ":") {
            fmt += (optional ? "" : part[0]) + "%s";
        } else {
            fmt += part;
        }
    }

    return fmt || "/";
};

function attachParams(re, params) {
    re.params = params;
    return re;
}

function Param(name, regexp, required) {
    this.name = name;
    this.regexp = regexp;
    this.required = required;
}

Param.prototype.toJSON = function(json) {
    json || (json = {});

    json.name = this.name;
    json.regexp = this.regexp;
    json.required = this.required;

    return json;
};
