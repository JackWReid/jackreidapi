git pull --no-edit origin master
cd /root/jackreidapi/site

date_str=$(date +"%Y-%m-%dT%T")
/home/linuxbrew/.linuxbrew/bin/hugo new note/$date_str.md
new_note_file="content/note/$date_str.md"
echo "---" > $new_note_file
echo "date: ${date_str}" >> $new_note_file
echo "title: $1" >> $new_note_file
echo "---" >> $new_note_file

git add .
git commit -am "new note"
git push origin master

/root/jackreidapi/scripts/update_site.sh

