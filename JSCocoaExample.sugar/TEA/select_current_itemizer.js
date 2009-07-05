// Framework

var console = {
	log: function(message){
		JSCocoaController.log(message);
	}
}

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



// Espresso TEA JSCocoa Implementation
// TODO: remove hard-coded implementation-specific codez
function Range(location, length){
	if (this instanceof Range) throw new Error("Don't use `new Range()`; use `Range()`"); // TODO: Reverse this logic once implemented as a MooTools class?
	return NSMakeRange(location, length);
};
Range.from = function(shouldBeRange){
	if (shouldBeRange.rangeValue)
		return Range.from(shouldBeRange.rangeValue);
	
	if (typeOf(shouldBeRange) === 'array')
		return Range(shouldBeRange[0], shouldBeRange.length === 1 ? 0 : shouldBeRange[shouldBeRange.length-1]);
	
	if (/number|string/.test(typeOf(shouldBeRange)))
		return Range(shouldBeRange, 0);
	
	if (shouldBeRange && typeOf(shouldBeRange.location)==='number' && typeOf(shouldBeRange.length)==='number')
		return Range(shouldBeRange.location, shouldBeRange.length);
};



Selection = {
	set: function(ranges){
		ranges = Array.prototype.map.call(ranges, function(range){
			return NSValue.valueWithRange(Range.from(range));
		});
		context.setSelectedRanges(ranges);
	},
/*
	setOne: function(valueWithRange){
		context.setSelectedRanges([NSValue.valueWithRange(Range.from(valueWithRange))]);
	},
*/
	get: function(){
		return context.selectedRanges;
	}
};



function getItemizerByRange(range){
	// TODO: Add support for repeated calls expanding outward
	return context.itemizer.smallestItemContainingCharacterRange(range);
};



// Implementation
function selectCurrentSelection(){
	
	Selection.set(Selection.get());
	
	return true;
};

function selectCurrentItemizer(){
	
	// var newRanges = Array.prototype.map.call(Selection.get(), getItemizerByRange);
	// console.log(newRanges);
	// Selection.set(newRanges);
	
	var newRanges = [];
	
	var selectedRanges = Selection.get();
	for (var i=0; i < selectedRanges.length; i++) {
		var range = selectedRanges[i];
		newRanges.push(getItemizerByRange(Range.from(range)).range);
	}
	
	Selection.set(newRanges);
	
	return true;
};


var main = selectCurrentItemizer;
