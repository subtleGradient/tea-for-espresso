var ranges = context.selectedRanges;
var range = ranges[0].rangeValue;
var text = 'Hello World';

var insertions = CETextRecipe.textRecipe;

insertions.addReplacementString_forRange_(text, range);
insertions.setUndoActionName_('JSCocoa Test');
context.applyTextRecipe_(insertions);

/*
MRRangeSet
CETextRecipe
CETextSnippet
SXSelectorGroup
*/
