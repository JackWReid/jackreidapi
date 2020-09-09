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

cd $SITEDIR
git pull --no-edit -q origin master

rm ./tmp/*
echo $1 > ./tmp/$date_str.txt
decoded=$(base64 -d ./tmp/$date_str.txt)
date_str=$(date +"%Y-%m-%d")

hugo new journal/$date_str.md
new_journal_file="content/journal/$date_str.md"
echo $decoded > $new_post_file

git add .
git commit -am "new journal"
git push origin master

$SITEDIR/scripts/update_site.sh

cat $new_journal_file
