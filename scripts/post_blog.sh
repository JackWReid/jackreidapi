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

cd $SITEDIR/site
git pull --no-edit -q origin master

rm ./tmp/*
echo $1 > ./tmp/$date_str.txt
slug=$2
decoded=$(base64 -d ./tmp/$date_str.txt)
date_str=$(date +"%Y-%m-%dT%T")

hugo new post/$date_str-$2.md
new_post_file="content/post/$date_str-$2.md"
echo $decoded > $new_post_file

git add .
git commit -am "new post"
git push origin master

$SITEDIR/scripts/update_site.sh

cat $new_post_file
