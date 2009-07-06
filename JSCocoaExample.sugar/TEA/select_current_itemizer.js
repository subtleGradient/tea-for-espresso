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
Range.match = function(rangeA, rangeB){
	rangeA = Range.from(rangeA);
	rangeB = Range.from(rangeB);
	return  rangeA.location == rangeB.location &&
			rangeA.length == rangeB.length
	;
};



function Item(){};
Item.getByRange = function(range){
	return context.itemizer.smallestItemContainingCharacterRange(range);
};
Item.getParentByRange = function(range){
	range = Range.from(range);
	var item = Item.getByRange(range);
	var newRange = item.range;
	
	// Select the parent if the range is the same
	while (Range.match(newRange, range) && item.parent) {
		item = item.parent;
		newRange = item.range;
	};
	return item;
};
Item.fromRange = function(range, getParentIfMatch){
	if (getParentIfMatch)
		return Item.getParentByRange(range);
	else
		return Item.getByRange(range);
};



function Selection(){};
Selection.set = function(ranges){
	ranges = Array.prototype.map.call(ranges, function(range){
		return NSValue.valueWithRange(Range.from(range));
	});
	context.setSelectedRanges(ranges);
}
Selection.get = function(){
	return context.selectedRanges;
};
Selection.expand = function(expandTo){
	expandTo = expandTo || 'Item';
	Selection['expandTo' + expandTo]();
}
Selection.expandToItem = function selectCurrentItemizer(){
	var newRanges = [];
	var selectedRanges = Selection.get();
	
	for (var i=0; i < selectedRanges.length; i++)
		newRanges.push( Item.fromRange(selectedRanges[i], true).range );
	
	Selection.set(newRanges);
	return newRanges;
};



// Implementation
var main = Selection.expandToItem;
