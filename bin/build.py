#!/usr/bin/env python
import os
import json
import argparse
import re


def scan_dir(path):
    path = os.path.realpath(path)

    dirs = os.popen("find " + path + " -maxdepth 1 -type d ").read().split("\n")

    return [d[len(path) + 1:] for d in dirs if d[len(path) + 1:] != ""]


def pull(path):
    cwd = os.getcwd()
    os.chdir(path)
    print os.popen("git pull").read()
    os.chdir(cwd)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('path', help="The path for static git repo")
    parser.add_argument('file', help="The file to output")
    parser.add_argument('--pull', dest="pull", type=bool, default=False)
    args = parser.parse_args()

    path = args.path
    output = args.file

    if args.pull:
        print "Prepare to pull the repo..."
        pull(path)

    print "Prepare scan dir to build json..."

    libs = []

    for lib in scan_dir(path):
        item = {"value": lib, "vers": [i for i in reversed([{"ver": v} for v in scan_dir(path + '/' + lib)])]}
        package = json.load(open(path + '/' + lib + '/package.json', 'r'))
        item["filename"] = package["filename"]
        item["tokens"] = re.split('[^a-zA-Z0-9]', package["filename"])
        libs.append(item)

    print "Prepare to save file..."

    f = open(output, 'w')
    f.write(json.dumps(libs))
    f.close()

    print "All finished!"

