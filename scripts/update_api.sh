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

deps=(docker-compose git)
for dep in "${deps[@]}"; do
  installed "${dep}" || die "Missing '${dep}'"
done

git checkout -f
git pull origin HEAD
docker-compose up -d --build books_update films_update articles_update pocket_update
