#!/usr/bin/python3

#  Copyright (c) 2011 - 2025, Zingaya, Inc. All rights reserved.

import argparse
import json
import re

parser = argparse.ArgumentParser(description='Voximplant Changelog Parser')
parser.add_argument('--input',  help='Input Markdown file', required=True)
parser.add_argument('--fqdn', help='FQDN of document', default='changelog')
parser.add_argument('--title', help='Title of document', default='Release Notes')
parser.add_argument('--output', help='Output JSON file', default='changelog.json')

args = parser.parse_args()
in_file_name = args.input
out_file_name = args.output

in_file = open(in_file_name, 'r')
changelog = in_file.readlines()
in_file.close()

output = {
    'fqdn': args.fqdn,
    'kind': 'changelog',
    'tags': [],
    'title': args.title,
    'content': []
}

strip_tags = re.compile('<.*?>')
content_block = {}
content_list = []
record = ''

for line in changelog:
    line = line.rstrip()
    if line == '':
        if content_list != []:
            content_block['content'].append({
                "kind": "content_list",
                "text": content_list
            })
            content_list = []
    elif line.startswith('# '):
        output['content'].append({
            'kind': 'content_top',
            'text': line.replace('# ', ''),
            'references': [],
            'marketplaceLink': ''
        })
    elif line.startswith('## '):
        if content_block != {}:
            content_block = {}

        content_block = {
            "kind": "content_block",
            "content": [
                {
                    "kind": "content_header",
                    "text": re.sub(strip_tags, '', line.replace('## ', ''))
                },
            ]
        }

        if content_block != {}:
            output['content'].append(content_block)
    elif line.startswith('### '):
        content_block['content'].append({
            "kind": "content_text",
            "text": line
        })
    elif line.lstrip().startswith('* '):
        if record != '':
            record = ''

        stripped = line.lstrip()
        leading_spaces = len(line) - len(stripped)
        if leading_spaces == 0:
            # Remove spaces and '*' for level 1
            record += stripped.replace('* ', '')
            if record != '':
                content_list.append(record)
        else:
            # Remove spaces and left '*'
            record += stripped
            if record != '':
                # Add sublist option to previous item
                content_list[-1] += '\n' + record
    else:
        record += '\n' + line.strip()

out_file = open(out_file_name, 'r')
documentation = json.load(out_file)
out_file.close()

documentation.append(output)

out_file = open(out_file_name, 'w')
json.dump(documentation, out_file, indent=4)
out_file.close()
