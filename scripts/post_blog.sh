cd /root/jackreidapi/site
git pull --no-edit -q origin master

rm ./tmp/*
echo $1 > ./tmp/$date_str.txt
slug=$2
decoded=$(base64 -d ./tmp/$date_str.txt)
date_str=$(date +"%Y-%m-%dT%T")

/home/linuxbrew/.linuxbrew/bin/hugo new post/$date_str-$2.md
new_post_file="content/post/$date_str-$2.md"
echo $decoded > $new_post_file

git add .
git commit -am "new post"
git push origin master

/root/jackreidapi/scripts/update_site.sh

cat $new_post_file
