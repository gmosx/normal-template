// try this: node last.js

var template = require("../lib/normal-template"),
	compile = template.compile;

exports.testReduce$last = function(test){
	// when reducing, $last should only be true on the last loop
	test.expect(1);
	
	var data = {list: ["milk", "bread", "pickles"]},
		t	 = compile("{:r list}{=.}{:if $last}.{:else}, {/:if}{/:r}");
	
	test.same("milk, bread, pickles.", t(data));
	
	test.done();
};

exports.testReduce$lastOutside = function(test){
	// $last should be undefined outside of a reduce loop
	test.expect(1);
	
	var data = { list: ['bananas'] },
		t	 = compile("{:if $last}yes{:else}no{/:if} {:r list}{=.}{/:r} {:if $last}{:else}today{/:if}");
	
	test.same("no bananas today", t(data));
	
	test.done();
};

exports.testReduce$lastSingle = function(test){
	// when reducing a list with a single item, $last should be true
	test.expect(1);
	
	var data = { list: ['chocolate'] },
		t	 = compile("{:r list}{=.}{:if $last}!{:else}, {/:if}{/:r}");
	
	test.same("chocolate!", t(data));
	
	test.done();
};

exports.testReduce$lastNested = function(test){
	// when a reduce loop is nested within another reduce loop, $last should stack
	test.expect(1);
	
	var data = { list: [{name:"dairy", items:["milk", "butter"]}, {name:"veg", items:["lettuce", "peppers", "pickles"]}] },
		t	 = compile("{:r list}{=name}: {:r items}{=.}{:if $last}{:else}, {/:if}{/:r}{:if $last}{:else} & {/:if}{/:r}");
	
	test.same("dairy: milk, butter & veg: lettuce, peppers, pickles", t(data));
	
	test.done();
};

if(module.id == '.'){
	var testrunner = require('nodeunit').testrunner;
	testrunner.run([__filename]);
}