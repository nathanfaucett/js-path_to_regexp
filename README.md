pathToRegExp
=======

pathToRegExp for the browser and node.js


```javascript
var pathToRegExp = require("@nathanfaucett/path_to_regexp");


var params = [],
    regexp = pathToRegExp("/parent/:parentId{[0-9]+}", params, false),
    regexpEnd = pathToRegExp("/parent/:parentId{[0-9]+}/child/:id{[0-9]+}(.:format{\\w+})", true);


console.log(regexp.exec("/parent/1/child/1"));
console.log(regexpEnd.exec("/parent/1/child/1.json"));

```
