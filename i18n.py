from subprocess import Popen, PIPE
import re
import argparse
import json


parser = argparse.ArgumentParser()
parser.add_argument('--bad', '-b', help='Show matches of potentially bad usage of strings', action='store_true')
parser.add_argument('--missing', '-m', help='Dont show missing strings in all locales', action='store_false')
parser.add_argument('--unused', '-u', help='Dont show unused strings from all locales', action='store_false')
parser.add_argument('--edit', '-e', help='Edit strings files in place and remove unused entries', action='store_true')
args = parser.parse_args()

#config settings, eventually convert this to cli args
showBadMatches = args.bad
showMissing = args.missing
showUnused = args.unused
editUnused = args.edit

process = Popen(["git", "grep", "strings"], stdout=PIPE)
(output, err) = process.communicate()
exit_code = process.wait()
pattern = re.compile(r"strings\([\'\"]([^\'\"]+)[\'\"]\)")

all_strings = set()

for line in output.decode("utf-8").split('\n'):
    if "import " in line or len(line) == 0:
        continue

    m = pattern.findall(line)
    if not m:
        #special case faq translation that uses faq.json
        if "strings(faq.q)}" in line or "strings(faq.a)}" in line:
            continue
        if showBadMatches:
            print("no match for: " + line)
        continue

    for str_key in m:
        if len(str_key) > 0:
            all_strings.add(str_key)

if showBadMatches:
    exit()

print(f'found {len(all_strings)} strings in JS files')

faq = json.load(open('Resources/faq.json'))

for entry in faq["faqs"]:
    all_strings.add(entry["q"])
    all_strings.add(entry["a"])

print(f'found {len(all_strings)} strings in total (js + faq.json)')

def check_locale(fileName):
    tf = json.load(open(fileName))

    if showMissing:
        for key in all_strings:
            parts = key.split('.')

            if not (parts[0] in tf) or not (parts[1] in tf[parts[0]]):
                print(f'{fileName} missing {key}')

    
    if showUnused:
        for ns in tf:
            for key in tf[ns]:
                key_name = f'{ns}.{key}'
                if not key_name in all_strings:
                    print(f'{fileName} has unused key: {key_name}')

    if editUnused:
        for ns in set(tf.keys()):
            for key in set(tf[ns].keys()):
                key_name = f'{ns}.{key}'
                if not key_name in all_strings:
                    del tf[ns][key]
            if len(tf[ns]) == 0:
                print(f'deleting ns {ns}')
                del tf[ns]
        with open(fileName, 'w+') as res:
            json.dump(tf, res, indent=2)



check_locale('locales/en.json')
check_locale('locales/es.json')