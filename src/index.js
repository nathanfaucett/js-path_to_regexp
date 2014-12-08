var rePartsMatcher = /\.\w+|\.\:\w+|\/+\w+|\/\:\w+|\:\w+(\[.+?\])?|\(.+?\)/g,
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
                params && params.push({
                    name: part.slice(1),
                    regexp: regexp,
                    required: false
                });
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
                params && params.push({
                    name: part.slice(1),
                    regexp: regexp,
                    required: true
                });
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

    return new RegExp(pattern, "i");
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