exports.testNormalTemplate = require("./normal-template");
exports.testNormalTPP = require("./normal-template/tpp");

if (module === require.main) {
    require("test").run(exports);
}    
