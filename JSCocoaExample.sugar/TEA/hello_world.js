// Some stuff taken from Moo2
// TODO: integrate some of MooTools 2 codez

Function.prototype.args = function(augmentArgs){
	if (typeOf(augmentArgs) != 'function') throw new TypeError('`Function.args` first argument must be a function');
	var self = this;
	return function(){
		self.apply(this, augmentArgs.apply(this,arguments));
	};
};

Array.prototype.$typeOf = function(){return 'array'};

var typeOf = function(item){
	if (item == null) return 'null';
	if (item.$typeOf) return item.$typeOf();
	
	if (item.nodeName){
		switch (item.nodeType){
			case 1: return 'element';
			case 3: return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
		}
	} else if (typeof item.length == 'number'){
		if (item.callee) return 'arguments';
		else if (item.item) return 'collection';
	}

	return typeof item;
};

/*
MRRangeSet
CETextRecipe
CETextSnippet
SXSelectorGroup
*/



var console = {
	log: function(message){
		JSCocoaController.log(message);
	}
}

function Snippet(text){
	
	this.snippet = String(text);
	this.insertions = CETextRecipe.textRecipe;
	this.insertions.set({ UndoActionName:this.snippet });
	
};
Snippet.prototype = {
	write: function(){
		this.insertions.add({
			ReplacementString: this.snippet,
			forRange: context.selectedRanges[0].rangeValue
		});
		context.apply({ TextRecipe:this.insertions });
		return this;
	}
};

	
/*
var hello_world = new Snippet('hello world');
var hello_world1 = new Snippet('hello world1');

hello_world.write();
hello_world1.write();
*/


String.prototype.toSnippet = function(){
	return new Snippet(this);
}
String.prototype.log = function(){
	console.log(this);
	return this;
}

/*
function getActiveZone(){
	// def get_active_zone(context, range):
	//     '''Returns the textual zone ID immediately under the cursor'''
	//     if context.syntaxTree().zoneAtCharacterIndex_(range.location) is not None:
	//         if context.syntaxTree().zoneAtCharacterIndex_(range.location).\
	//            typeIdentifier() is not None:
	//             return context.syntaxTree().zoneAtCharacterIndex_(range.location).\
	//                    typeIdentifier().stringValue()
	//     # Made it here, something's wrong
	//     return False
	
	// return Array.prototype.map.call(context.selectedRanges, function(range){try{
	var range = context.selectedRanges[0];
	return context
	.syntaxTree
	.zoneAtCharacterIndex(range.location);
	// .typeIdentifier
	// .stringValue;
	// }catch(e){return String(e);};});
	
};
*/



function main_(){
	
	// context.syntaxTree.rootZone.typeIdentifier.stringValue
	// 	.log().toSnippet().write();
	// 
	// console.log(context.syntaxTree.rootZone.typeIdentifier);
	
	// console.log(getActiveZone())
	
	var range = context.selectedRanges[0];
	
	console.log(context.selectedRanges[0]);
	console.log(context.selectedRanges[0].rangeValue);
	
	console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue) )
	console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).typeIdentifier )
	// console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).range.rangeValue )
	// console.log( typeof context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).range )
	var r = context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).range;
	// for (var property in r) {
	// 	console.log(property);
	// 	console.log(r[property])
	// }
	// for (var i=0; i < r.length; i++) {
	// 	console.log(r[i])
	// }
	
	// console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).syntaxRange.startZone.range.stringValue )
	// console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).range.stringValue )
	// console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).itemizedText )
	// console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).itemizedText.items[0] )
	// console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).itemizedText.items[0].range )
	// console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).itemizedText.items[0].range.rangeValue )
	
	// console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).syntaxRange.startZone )
	// console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).syntaxRange.startZone.range.rangeValue )
	// console.log( context.itemizer.smallestItemContainingCharacterRange(range.rangeValue).syntaxRange.startZone.childCount )
	
	// var newRange = NSMakeRange(r.location, r.length);
	var newRange = [r.location, r.length];
	// console.log(newRange)
	// console.log([r.location, r.length]);
	// context.set({ SelectedRanges: [[r.location, r.length]] });
	var newRanges = [];
	newRanges[0] = newRange;
	newRange.location = r.location;
	newRange.length = r.length;
	// console.log({ SelectedRanges:newRanges });
	// var selectedRange = {};
	// selectedRange.SelectedRanges = newRanges;
	context.setSelectedRanges(newRanges);
	
	
	return true;
};



function selectCurrentItemizerItem(selectedRange){
	var itemRange = context.itemizer.smallestItemContainingCharacterRange(selectedRange.rangeValue).range;
	var testRange = NSValue.valueWithRange(NSMakeRange(itemRange.location, itemRange.length));
	
	context.setSelectedRanges([testRange]);
};

// Array.prototype.toRange = function(){
// 	return NSValue.valueWithRange(NSMakeRange(itemRange.location, itemRange.length));
// };
// 
// function selectRange(){};


// Espresso TEA JSCocoa Implementation
// TODO: remove hard-coded implementation-specific codez
function Range(location, length){
	if (this instanceof Range) throw new Error("Don't use `new Range()`; use `Range()`"); // TODO: Reverse this logic once implemented as a MooTools class?
	return NSMakeRange(location, length);
};
Range.from = function(shouldBeRange){
	if ('rangeValue' in shouldBeRange)
		return Range.from(shouldBeRange.rangeValue);
	
	if (typeOf(shouldBeRange) === 'array')
		return Range(shouldBeRange[0], shouldBeRange.length === 1 ? 0 : shouldBeRange[shouldBeRange.length-1]);
	
	if (/number|string/.test(typeOf(shouldBeRange)))
		return Range(shouldBeRange, 0);
	
	if (shouldBeRange && typeOf(shouldBeRange.location)==='number' && typeOf(shouldBeRange.length)==='number')
		return Range(shouldBeRange.location, shouldBeRange.length);
};

function Itemizer(itemizer){
	this.itemizer = itemizer;
};
Itemizer.prototype = {
	find: function(range){
		console.log(range);
		range = Range.from(range);
		// return this.itemizer.smallestItemContainingCharacterRange(range);
	}//.args(Range.from),
};
Itemizer.main = new Itemizer(context.itemizer);

Itemizer.Item = function(item){
	this.item = item;
};
Itemizer.Item.prototype = {
	select: function(){
		Selection.set(this.item.range);
		return this;
	}
};

Selection = {
	set: function(valueWithRange){
		context.setSelectedRanges(Array.prototype.map.call(arguments,function(range){
			return NSValue.valueWithRange(Range.from(range));
		}));
	},
	get: function(){
		return context.selectedRanges;
	}
};


function main(){
	
	// Itemizer.main.find(Selection.get()).select();
	
	// for each selection
	var selection = Selection.get();
	// get its itemizer item
	// select it
	
	return true;
};



function inspect(object){
	console.log(object);
	console.log(typeOf(object));
	// console.log(String(object));
	switch(typeOf(object)){
	case 'function':
	case 'object':
		console.log('forin');
		for (var property in object) {
			inspect(object[property]);
		}
		console.log('end forin');
		break;
	case 'array':
		console.log('forEach');
		for (var i=0; i < object.length; i++) {
			inspect(object[i]);
		}
		console.log('end forEach');
		break;
	default:
		if (object.length) return inspect(Array.prototype.slice.apply(object));
		// console.log(object);
	}
};






// get the settings defined by ContextualSettings
// context.settingForKey_inRange_('whatever',range)
