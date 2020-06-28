import json
import os
import re
import argparse
from anytree import Node, AnyNode
from anytree.search import find_by_attr
from anytree.exporter import JsonExporter

parser = argparse.ArgumentParser()
parser.add_argument("path")
parser.add_argument("output")
args = parser.parse_args()

if args.path[-1] != '/':
    args.path += '/'

PATH = "/home/j/foundrydata/Data/modules/lk-import/wiki/"
REGEX_WRAP = re.compile("<div class='lk-tab' id='.*'>(.*?)<\/div>$")
REGEX_LINK = re.compile('<a href=\\".{25}\.html\\">(.*?)<\/a>')
REGEX_SPEC = re.compile(r"<div data-node-type[^>]*>(.*?)<\/div>")

json_files = [f for f in os.listdir(args.path) if f.endswith(".json")]
json_files.remove("index.json")
json_structures = [json.load(open(args.path + j)) for j in json_files]

root = Node("root")

top_level = [j for j in json_structures if j["parentId"] is None]
for structure in top_level:
    node = AnyNode(id=structure["id"], parent=root, name=structure["name"], data=structure["documents"][0]["content"])
    json_structures.remove(structure)

index = 0
while(len(json_structures) > 0):
    structure = json_structures[index]
    found = find_by_attr(root, name="id", value=structure["parentId"])
    if found:
        content = json_structures.pop(index)["documents"][0]["content"]
        content = REGEX_WRAP.findall(content.strip())[0]
        links = REGEX_LINK.finditer(content)
        for link in links:
            content = content.replace(link.group(0), "@JournalEntry[" + link.group(1) + "]")

        special = REGEX_SPEC.finditer(content)
        for spec in special:
            content = content.replace(spec.group(0), "")
        
        node = AnyNode(id=structure["id"], parent=found, name=structure["name"], data=content)
        index = 0
    else:
        index = index + 1
        if index > len(json_structures):
            index = 0

exporter = JsonExporter()
exporter.write(root, open(args.output, "w"))