'''Wraps selected text in a link (what kind of link based on context)'''

import subprocess
import re

import tea_actions as tea

def encode_ampersands(text):
    '''Encodes ampersands for use in links'''
    return re.sub('&(?!([a-zA-Z0-9]+|#[0-9]+|#x[0-9a-fA-F]+);)', '&amp;', text)

def format_hyperlink(text, fallback=''):
    if re.match(r'(mailto:)?(.+?@.+\..+)$', text):
        # Email; ensure it has a mailto prefix
        return re.sub(r'(mailto:)?(.*?@.*\..*)$', r'mailto:\2', text)
    elif re.search(r'http://(?:www\.)?(amazon\.(?:com|co\.uk|co\.jp|ca|fr|de))'\
                   r'/.+?/([A-Z0-9]{10})/[-a-zA-Z0-9_./%?=&]+', text):
        # Amazon URL; rewrite it with short version
        return re.sub(r'http://(?:www\.)?'\
                      r'(amazon\.(?:com|co\.uk|co\.jp|ca|fr|de))'\
                      r'/.+?/([A-Z0-9]{10})/[-a-zA-Z0-9_./%?=&]+',
                      r'http://\1/dp/\2',
                      text)
    elif re.match(r'[a-zA-Z][a-zA-Z0-9.+-]+?://.*$', text):
        # Unknown prefix
        return encode_ampersands(text)
    elif re.match(r'.*\.(com|uk|net|org|info)(/.*)?$', text):
        # Recognizable URL without http:// prefix
        return 'http://' + encode_ampersands(text)
    elif re.match(r'\S+$', text):
        # No space characters, so could be a URL; toss 'er in there
        return encode_ampersands(text)
    else:
        # Nothing that remotely looks URL-ish; give them the fallback
        return fallback

def act(context, undo_name='Wrap Selection In Link',
        default='<a href="${1:$URL}"${2: title="$3"}>$SELECTED_TEXT</a>$0',
        **syntaxes):
    '''
    Required action method
    
    A flexible link generator which uses the clipboard text (if there's
    a recognizable link there) and formats the snippet based on the
    active syntax of the context
    '''
    # Get the text and range
    text, range = tea.get_single_selection(context)
    if text == None:
        return False
    
    # Get the clipboard contents, parse for a URL
    process = subprocess.Popen(['pbpaste'], stdout=subprocess.PIPE)
    clipboard, error = process.communicate(None)
    # Construct the default link
    url = format_hyperlink(clipboard, fallback='http://')
    # Get the snippet based on the root zone
    # TODO: I need to implement better syntax zone sniffing to find
    #       the lowest nested zone available
    zone = context.syntaxTree().root().typeIdentifier()
    if zone in syntaxes:
        snippet = syntaxes[zone]
    else:
        snippet = default
    snippet = tea.construct_snippet(text, snippet)
    snippet = snippet.replace('$URL', tea.sanitize_for_snippet(url))
    return tea.insert_snippet_over_selection(context, snippet, range,
                                             undo_name)