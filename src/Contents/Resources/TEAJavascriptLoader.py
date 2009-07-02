'''
Text Editor Actions Javascript Loader

A loader class to execute JSCocoa scripts in Espresso
'''

import os

from Foundation import *
import objc

import JSCocoaFramework

from TEALoader import TEALoader
from espresso import *

# This really shouldn't be necessary thanks to the Foundation import
# but for some reason the plugin dies without it
NSObject = objc.lookUpClass('NSObject')

class TEAJavascriptLoader(TEALoader):
    '''
    Dynamically loads up JSCocoa and executes a Javascript file
    '''
    @objc.signature('B@:@')
    def performActionWithContext_error_(self, context):
        '''
        Populates JSCocoa with necessary objects, runs the script
        '''
        if self.script is None:
            tea.log('No script found')
            return False
        self.script += '.js'
        # Check for user script overrides
        file = os.path.join(os.path.expanduser(
            '~/Library/Application Support/Espresso/TEA/Scripts/'
        ), self.script)
        if not os.path.exists(file):
            file = os.path.join(self.bundle_path, 'TEA', self.script)
        if not os.path.exists(file):
            # File doesn't exist in the bundle, either, so something is screwy
            return tea.say(
                context, 'Error: could not find script',
                'TEA could not find the script associated with this action. '\
                'Please contact the Sugar developer, or make sure it is '\
                'installed here:\n\n'\
                '~/Library/Application Support/Espresso/TEA/Scripts'
            )
        # Initialize JSCocoa
        JSCocoa = objc.lookUpClass('JSCocoa')
        jsc = JSCocoa.new()
        # Populate Javascript with important objects
        jsc.setObject_withName_(context, 'context')
        jsc.setObject_withName_(MRRangeSet, 'MRRangeSet')
        jsc.setObject_withName_(CETextRecipe, 'CETextRecipe')
        jsc.setObject_withName_(CETextSnippet, 'CETextSnippet')
        jsc.setObject_withName_(SXSelectorGroup, 'SXSelectorGroup')
        # Run it!
        jsc.evalJSFile_(file)
        return True
