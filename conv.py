import json
import xml.etree.ElementTree as ET
import sys
import os

def translate_file(in_file, out_file):
    print(f'translating {in_file}')
    strings = ET.parse(in_file)
    root_trans = dict()
    for strs in strings.getroot():
        attr = strs.attrib['name']
        text = strs.text 

        #cleanup2
        if "<" in text:
            text = text[text.index('>') + 1 : text.rfind('<')]
        ns = 'global'
        key = attr

        #escapes <o>
        text = text.replace("\\n", "\n")
        text = text.replace("\\'", "'")
        text = text.replace("\\‘", "‘")
        text = text.replace("\\’", "’")
        if text.find("\\") >= 0:
            print("Bad Escape: " + attr + ":: " + text[text.index("\\"):  text.index("\\") + 2])

        try:
            idx = attr.index('_')
            ns = attr[0:idx]
            key = attr[idx + 1:]
        except ValueError:
            pass

        if not ns in root_trans:
            root_trans[ns] = dict()
        root_trans[ns][key] = text
    with open(out_file, 'w+') as res:
        json.dump(root_trans, res, indent=2)

base_dir = sys.argv[1]

translate_file(os.path.join(base_dir, 'app/src/main/res/values/strings.xml'), 'locales/en.json')
translate_file(os.path.join(base_dir, 'app/src/main/res/values-es/strings.xml'), 'locales/es.json')
print("done")