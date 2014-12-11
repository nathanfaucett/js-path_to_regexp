global.pathToRegexp = require("../src/index");


var params = [],
    regexp = pathToRegexp("/parent_:parentId[0-9]", params, false),

    paramsEnd = [],
    regexpEnd = pathToRegexp("/parent_:parentId[0-9]/child/:id(.:format)", paramsEnd, true);

console.log(params);
console.log(paramsEnd);

console.log(regexp.exec("/parent_1/child/1"));
console.log(regexpEnd.exec("/parent_1/child/1"));
