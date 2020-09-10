#!/bin/bash
set -eo pipefail
export PATH=/usr/bin:/bin:/usr/local/bin

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
curl -Lk localhost:3000/books/reading?limit=5000 | jq . > $SITEDIR/site/data/books/reading.json;
curl -Lk localhost:3000/books/toread?limit=5000 | jq . > $SITEDIR/site/data/books/toread.json;
curl -Lk localhost:3000/books/read?limit=5000 | jq . > $SITEDIR/site/data/books/read.json;

curl -Lk localhost:3000/films/watched?limit=5000 | jq . > $SITEDIR/site/data/films/watched.json;
curl -Lk localhost:3000/films/towatch?limit=5000 | jq . > $SITEDIR/site/data/films/towatch.json;

curl -Lk localhost:3000/pocket?limit=5000 | jq . > $SITEDIR/site/data/pocket.json;
curl -Lk localhost:3000/articles?limit=5000 | jq . > $SITEDIR/site/data/articles.json;

# Update git
echo "[$(date)] Committing updated media data files"
if [ -z "$(git status --porcelain)" ]; then
	echo "[$(date)] No changes found"
else
	echo "[$(date)] Changes found"
	git add . && git commit -m "[$(date)] Updated media data files" && git push origin master;
fi

docker-compose up -d --build site
