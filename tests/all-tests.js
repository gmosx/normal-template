exports.testNormalTemplate = require("./normal-template-tests");
exports.testNormalTPP = require("./normal-template/tpp-tests");

if (require.main == module.id)
    require("os").exit(require("test/runner").run(exports));
