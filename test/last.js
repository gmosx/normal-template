// try this: node last.js

var template = require("../lib/normal-template"),
	compile = template.compile;

exports.testReduce$last = function(test){
	test.expect(1);
	
	var data = {list: ["milk", "bread", "pickles"]},
		t	 = compile("{:r list}{=.}{:if $last}.{:else}, {/:if}{/:r}");
	
	test.same("milk, bread, pickles.", t(data));
	
	test.done();
};

exports.testReduce$lastOutside = function(test){
	test.expect(1);
	
	var data = { list: ['bananas'] },
		t	 = compile("{:if $last}yes{:else}no{/:if} {:r list}{=.}{/:r} {:if $last}{:else}today{/:if}");
	
	test.same("no bananas today", t(data));
	
	test.done();
};

exports.testReduce$lastSingle = function(test){
	test.expect(1);
	
	var data = { list: ['chocolate'] },
		t	 = compile("{:r list}{=.}{:if $last}!{:else}, {/:if}{/:r}");
	
	test.same("chocolate!", t(data));
	
	test.done();
};

exports.testReduce$lastNested = function(test){
	test.expect(1);
	
	var data = { list: [{name:"dairy", items:["milk", "butter"]}, {name:"veg", items:["lettuce", "peppers", "pickles"]}] },
		t	 = compile("{:r list}{=name}: {:r items}{=.}{:if $last}.{:else}, {/:if}{/:r}{:if $last}{:else} & {/:if}{/:r}");
	
	test.same("dairy: milk, butter. & veg: lettuce, peppers, pickles.", t(data));
	
	test.done();
};

if(module.id == '.'){
	var testrunner = require('nodeunit').testrunner;
	testrunner.run([__filename]);
}