'''
Text Editor Actions Javascript Loader

A loader class to execute JSCocoa scripts in Espresso
'''

from Foundation import *
import objc

from TEALoader import TEALoader

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
        pass
