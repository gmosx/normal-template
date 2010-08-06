var assert = require("assert");

var template = require("../lib/normal-template"),
	compile = template.compile;

exports.testReduce$last = function (test) {
	// when reducing, $last should only be true on the last loop
	var data = {list: ["milk", "bread", "pickles"]},
		t	 = compile("{:r list}{=.}{:if $last}.{:else}, {/:if}{/:r}");
	
	assert.equal("milk, bread, pickles.", t(data));
};

exports.testReduce$lastOutside = function (test) {
	// $last should be undefined outside of a reduce loop
	var data = { list: ['bananas'] },
		t	 = compile("{:if $last}yes{:else}no{/:if} {:r list}{=.}{/:r} {:if $last}{:else}today{/:if}");
	
	assert.equal("no bananas today", t(data));
};

exports.testReduce$lastSingle = function (test) {
	// when reducing a list with a single item, $last should be true
	var data = { list: ['chocolate'] },
		t	 = compile("{:r list}{=.}{:if $last}!{:else}, {/:if}{/:r}");
	
	assert.equal("chocolate!", t(data));
};

exports.testReduce$lastNested = function (test) {
	// when a reduce loop is nested within another reduce loop, $last should stack
	var data = { list: [{name:"dairy", items:["milk", "butter"]}, {name:"veg", items:["lettuce", "peppers", "pickles"]}] },
		t	 = compile("{:r list}{=name}: {:r items}{=.}{:if $last}{:else}, {/:if}{/:r}{:if $last}{:else} & {/:if}{/:r}");
	
	assert.equal("dairy: milk, butter & veg: lettuce, peppers, pickles", t(data));
};

if (module === require.main) {
    require("test").run(exports);
}
