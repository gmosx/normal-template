// try this: node last.js

var template = require("../lib/normal-template"),
	compile = template.compile;

exports.testReduce$last = function(test){
	test.expect(1);
	
	var data = {items: ["milk", "bread", "pickles"]},
		t	 = compile("{:r items}{=.}{:if $last}.{:else}, {/:if}{/:r}");
	
	test.same("milk, bread, pickles.", t(data));
	
	test.done();
};

if(module.id == '.'){
	var testrunner = require('nodeunit').testrunner;
	testrunner.run([__filename]);
}