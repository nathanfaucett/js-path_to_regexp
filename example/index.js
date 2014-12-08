global.pathToRegexp = require("../src/index");


var params = [],

    regexp = pathToRegexp("/parent/:parentId", params, false),

    regexpEnd = pathToRegexp("/parent/:parentId/child/:id", params, true);


console.log(regexp.exec("/parent/1/child/1"));
console.log(regexpEnd.exec("/parent/1/child/1"));
