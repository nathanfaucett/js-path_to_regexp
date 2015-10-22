var tape = require("tape"),
    pathToRegExp = require("..");


tape("pathToRegExp(path: String[, params: Array[, end: Boolean]])", function(assert) {
    var regExp = pathToRegExp("/parent/parent_:parentId[0-9]"),
        regExpParams = regExp.params,

        endRegExp = pathToRegExp("/parent/parent_:parentId[0-9]/child/:id[0-9](.:format)", true),
        endRegExpParams = endRegExp.params;

    assert.equal(regExp.test("/parent/parent_1/child/1"), true);
    assert.equal(regExp.test("/parent/parent"), false);

    assert.deepEqual(regExpParams, [{
        name: "parentId",
        regexp: "[0-9]",
        required: true
    }]);

    assert.equal(endRegExp.test("/parent/parent_1/child/1"), true);
    assert.equal(endRegExp.test("/parent/parent_1/child/1.json"), true);
    assert.equal(endRegExp.test("/parent/parent"), false);

    assert.deepEqual(endRegExpParams, [{
        name: "parentId",
        regexp: "[0-9]",
        required: true
    }, {
        name: "id",
        regexp: "[0-9]",
        required: true
    }, {
        name: "format",
        regexp: "[a-zA-Z0-9-_]",
        required: false
    }]);

    assert.end();
});
