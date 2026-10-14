"""Update only demo settings/contact links on the local pitch CMS."""
import http.cookiejar
import json
import urllib.request
from pathlib import Path

BASE = 'http://localhost:4322'
jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
opener.open(BASE + '/_emdash/api/auth/dev-bypass').read()

def api(path, method='GET', data=None):
    body = None if data is None else json.dumps(data).encode()
    request = urllib.request.Request(BASE + '/_emdash/api/' + path, data=body,
        headers={'Content-Type': 'application/json', 'Origin': BASE,
                 'X-EmDash-Request': '1'}, method=method)
    result = json.load(opener.open(request))
    if not result.get('success'): raise RuntimeError(result.get('error'))
    return result['data']

settings = api('settings')
Path('/tmp/warpcart-settings-before.json').write_text(json.dumps(settings))
if settings.get('title') in (None, '', 'Acme'):
    updated = api('settings', 'POST', json.loads(Path('scripts/content/settings.json').read_text()))
    print('Local settings:', updated.get('title'), '/', updated.get('tagline'))
else:
    print('Preserved authored settings:', settings.get('title'))
menu = api('menus/footer_support')
for item in menu['items']:
    if item.get('customUrl') == 'mailto:hello@acme.example':
        api('menus/footer_support/items/' + item['id'], 'PUT',
            {'label': 'WhatsApp', 'customUrl': 'https://wa.me/254119413044'})
        print('Replaced demo footer email with verified WhatsApp contact')
