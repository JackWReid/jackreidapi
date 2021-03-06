#!/bin/bash
set -eo pipefail
export PATH=/usr/bin:/bin:/usr/local/bin
SITEDIR=/home/jack/server

function installed {
  cmd=$(command -v "${1}")

  [[ -n "${cmd}" ]] && [[ -f "${cmd}" ]]
  return ${?}
}

function die {
  >&2 echo "Fatal: ${@}"
  exit 1
}

deps=(git)
for dep in "${deps[@]}"; do
  installed "${dep}" || die "Missing '${dep}'"
done

cd $SITEDIR
git checkout -f
git pull origin HEAD
node $SITEDIR/scripts/update_articles.js

