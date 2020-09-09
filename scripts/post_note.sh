#!/bin/bash

function installed {
  cmd=$(command -v "${1}")

  [[ -n "${cmd}" ]] && [[ -f "${cmd}" ]]
  return ${?}
}

function die {
  >&2 echo "Fatal: ${@}"
  exit 1
}

deps=(hugo git)
for dep in "${deps[@]}"; do
  installed "${dep}" || die "Missing '${dep}'"
done
git pull --no-edit origin master
cd ~/server/jackreidapi/site

date_str=$(date +"%Y-%m-%dT%T")
hugo new note/$date_str.md
new_note_file="content/note/$date_str.md"
echo "---" > $new_note_file
echo "date: ${date_str}" >> $new_note_file
echo "title: $1" >> $new_note_file
echo "---" >> $new_note_file

git add .
git commit -am "new note"
git push origin master

~/server/jackreidapi/scripts/update_site.sh

cat $new_note_file
