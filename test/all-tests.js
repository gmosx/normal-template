exports.testNormalTemplate = require("./normal-template");
exports.testNormalTPP = require("./normal-template/tpp");
//exports.testLast = require("./last");

if (module === require.main) {
    require("test").run(exports);
}    
