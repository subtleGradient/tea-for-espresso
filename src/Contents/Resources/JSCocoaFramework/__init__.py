'''
Python mapping for the JSCocoa framework.
'''

import os.path

from Foundation import NSBundle
import objc

objc.loadBundle("JSCocoa",
	globals(),
    bundle_path=objc.pathForFramework(
        os.path.join(
            NSBundle.bundleWithIdentifier_('com.onecrayon.tea.espresso').bundlePath(),
            "Contents",
            "Frameworks", 
            "JSCocoa.framework"
        )
    )
)