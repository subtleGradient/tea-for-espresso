'''
Text Editor Actions Javascript Loader

A loader class to execute JSCocoa scripts in Espresso
'''

import os.path

from JavaScriptCore import JSValueRef

import JSCocoaFramework

import tea_actions as tea
from TEALoader import TEALoader
from espresso import *


class TEAJavascriptLoader(TEALoader):
    '''
    Dynamically loads up JSCocoa and executes a Javascript file
    '''
    @objc.signature('B@:@@')
    def performActionWithContext_error_(self, context, error):
        '''
        Populates JSCocoa with necessary objects, runs the script
        '''
        if self.script is None:
            tea.log('No script found')
            return False
        # Check for user script overrides
        if self.script[-3:] != '.js':
            script = self.script + '.js'
        else:
            script = self.script
        file = os.path.join(os.path.expanduser(
            '~/Library/Application Support/Espresso/TEA/Scripts/'
        ), script)
        if not os.path.exists(file):
            file = os.path.join(self.bundle_path, 'TEA', script)
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
        
        # Load up the file
        # If no act() function, this is all that needs to be done
        jsc.evalJSFile_(file)
        
        if jsc.hasJSFunctionNamed_('act'):
            function = 'act'
        elif jsc.hasJSFunctionNamed_('main'):
            function = 'main'
        else:
            function = False
        
        if function:
            # Run the function
            result = jsc.unboxJSValueRef_(
                jsc.callJSFunctionNamed_withArguments_(function, None)
            )
            # Oddly, returning false from Javascript results in None
            if result is None:
                return False
            else:
                return result
        
        # If we get here, we didn't have a function to evaluate
        return True
