'''Utility functions for working with TEA for Espresso'''

from Foundation import *

from espresso import *

# ===============================================================
# Interact with the user and output information
# ===============================================================

def ask(context, question, default=''):
    '''Displays a dialog box asking for user input'''
    return True

def say(context, title, message,
        main_button=None, alt_button=None, other_button=None):
    '''Displays a dialog with a message for the user'''
    alert = NSAlert.alertWithMessageText_defaultButton_alternateButton_otherButton_informativeTextWithFormat_(
        title,
        main_button,
        alt_button,
        other_button,
        message
    )
    
    return alert.beginSheetModalForWindow_modalDelegate_didEndSelector_contextInfo_(
        context.windowForSheet(), None, None, None
    )

def log(message):
    '''Convenience function for logging messages to console'''
    NSLog(message)

# ===============================================================
# Preference lookup shortcuts
# ===============================================================

def get_prefs(context):
    '''
    Convenience function; returns a CETextPreferences object with
    current preferences
    '''
    return context.textPreferences()

def get_line_ending(context):
    prefs = get_prefs(context)
    return prefs.lineEndingString()

# ===============================================================
# Interact with the text window
# ===============================================================

def get_selection(context, range):
    '''Convenience function; returns selected text within a given range'''
    return context.string().substringWithRange_(range)

def get_single_selection(context, with_errors=True):
    '''
    If there's a single selection, returns the selected text,
    otherwise throws optional descriptive errors
    
    Returns a tuple with the selected text first and its range second
    '''
    ranges = context.selectedRanges()
    # Since there aren't good ways to deal with discontiguous selections
    # verify that we're only working with a single selection
    if len(ranges) != 1:
        if with_errors:
            say(
                context, "Error: multiple selections detected",
                "You must have a single selection in order to use this action."
            )
        return None, None
    # For some reason, range is not an NSRange; it's an NSConcreteValue
    # This converts it to an NSRange which we can work with
    range = ranges[0].rangeValue()
    if range.length is 0:
        if with_errors:
            say(
                context, "Error: selection required",
                "You must select some text in order to use this action."
            )
        return None, range
    return get_selection(context, range), range

def new_range_set(context):
    '''
    Convenience function; returns the MRRangeSet for the selection in
    the current context
    
    For range set methods, see Espresso.app/Contents/Headers/MRRangeSet.h
    '''
    return MRRangeSet.alloc().initWithRangeValues_(context.selectedRanges())

def new_recipe():
    '''
    Convenience function to create a new text recipe
    
    For recipe methods, see Espresso.app/Contents/Headers/EspressoTextCore.h
    '''
    return CETextRecipe.textRecipe()

def insert_text_over_selection(context, text, range, undo_name=None):
    '''Immediately replaces the text at range with passed in text'''
    insertions = new_recipe()
    insertions.addReplacementString_forRange_(text, range)
    if undo_name != None:
        insertions.setUndoActionName_(undo_name)
    return context.applyTextRecipe_(insertions)

# ===============================================================
# Snippet utilities
# ===============================================================

def sanitize_for_snippet(text):
    '''Escapes special characters used by snippet syntax'''
    return text.replace('#', '\#')

def construct_tag_snippet(text, number=1, default_tag='p'):
    '''
    Sets up the standard single-tag snippet; can be repeated
    for a string of mirrored tags
    '''
    # Currently meaningless, since there are no escape capabilities
    text = sanitize_for_snippet(text)
    if number > 1:
        first_segment = '#1'
    else:
        first_segment = '#{1:' + default_tag + '}'
    return '<' + first_segment + '>' + text + '</#{1/\s.*//}>#0'

def insert_snippet(context, snippet):
    '''Convenience function to insert a text snippet'''
    snippet = CETextSnippet.snippetWithString_(snippet)
    return context.insertTextSnippet_(snippet)

def insert_snippet_over_selection(context, snippet, range, undo_name=None):
    '''Replaces text at range with a text snippet'''
    deletions = new_recipe()
    deletions.addDeletedRange_(range)
    if undo_name != None:
        deletions.setUndoActionName_(undo_name) 
    # Apply the deletions
    context.applyTextRecipe_(deletions)
    # Insert the snippet
    return insert_snippet(context, snippet)
