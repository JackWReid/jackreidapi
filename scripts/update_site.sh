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

deps=(curl git)
for dep in "${deps[@]}"; do
  installed "${dep}" || die "Missing '${dep}'"
done

echo "[$(date)] Starting book and film data update"
cd $SITEDIR
git checkout -f;
git pull origin HEAD;

# Download latest data from API
curl -Lk https://api.jackreid.xyz/books/reading?limit=5000 | jq . > $SITEDIR/site/data/books/reading.json;
curl -Lk https://api.jackreid.xyz/books/toread?limit=5000 | jq . > $SITEDIR/site/data/books/toread.json;
curl -Lk https://api.jackreid.xyz/books/read?limit=5000 | jq . > $SITEDIR/site/data/books/read.json;

curl -Lk https://api.jackreid.xyz/films/watched?limit=5000 | jq . > $SITEDIR/site/data/films/watched.json;
curl -Lk https://api.jackreid.xyz/films/towatch?limit=5000 | jq . > $SITEDIR/site/data/films/towatch.json;

curl -Lk https://api.jackreid.xyz/articles?limit=5000 | jq . > $SITEDIR/site/data/all_articles.json;
curl -Lk https://api.jackreid.xyz/articles/fave?limit=5000 | jq . > $SITEDIR/site/data/fave_articles.json;

# Update git
echo "[$(date)] Committing updated media data files"
if [ -z "$(git status --porcelain)" ]; then
	echo "[$(date)] No changes found"
else
	echo "[$(date)] Changes found"
	git add . && git commit -m "[$(date)] Updated media data files" && git push origin master;
fi

cd site
hugo
