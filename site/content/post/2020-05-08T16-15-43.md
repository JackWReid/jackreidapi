---
title: How this site works
subtitle: A quick tour of my personal infrastructure
slug: how-this-site-works
date: 2020-05-08T16:11:43.634Z
draft: false
tags:
  - dev
---

*Note:* There's a follow up to this because I've since made more changes to the infrastructure of the site. [Read more](/post/getting-of-off-netlify).

I’ve been slowly moving over to self-hosting more services and trying to balance that with personal convenience. This post is a quick summary of the current setup I have running to do the following:

* Develop and run my personal website
* Cross-post certain types of content from my website to Twitter
* Periodically scrape a couple of proprietary services I use, to keep track of the media I’m consuming
* Store and serve that data along with some other personal data in an API
* Regularly update my personal website with the latest in my media consumption

## Personal website

My website is built on [Hugo](https://gohugo.io/ "Hugo"), a static suite builder written in Go. I like that all the content on my website can be markdown files with some front-matter, any extra data can be in simple JSON files, and the template system is very simple. I’ve spent a lot of time tweaking and playing with this Hugo site, but really it would work just fine without much work at all.

The site is deployed to [Netlify](https://www.netlify.com/ "Netlify") for now. When I make changes in the website repo and push to master, it triggers a build in Netlify and the site is quickly updated, built, and deployed. Someday I might like to self-host this, I don’t think it’d be hard. But for now I like how easy this part of the flow is. I’ve also recently started using [Netlify CMS](https://www.netlifycms.org/ "Netlify CMS") and I like the way it’s just a convenient layer over the filesystem “CMS”. I’ve also built some simple forms that allow me to post notes and links from my phone, which has a text expansion shortcut for my GitHub token.

I don’t use any JavaScript on the site at the time of writing (other than a small library that allows me to login to Netlify CMS), nor do I use any CSS frameworks.

## Cross-posting

Posts like this, highlights from the web, and notes (which are basically like cross-platform tweets) are all cross-posted from the website to Twitter. [IFTTT](https://ifttt.com/ "IFTTT") (If This, Then That) handles that by watching the RSS feeds Hugo automatically generates, composing a tweet based on a simple per-format template, and tweeting to my personal account. There are more IndieWeb ways to do this kind of thing, but I haven’t enjoyed working with [Bridgy](https://brid.gy/ "Bridgy") and the IndieWeb auth solutions thus far.

## Scraping

I spend a lot of my life reading, watching, or listening to various forms of media. I keep track of what I’ve read or want to read, or what I’ve watched or want to watch - with a couple of proprietary services. I use [Goodreads](https://www.goodreads.com/user/show/54047855-jack-reid "Goodreads") to track books, [Letterboxd](https://letterboxd.com/jackreid/ "Letterboxd") to track TV and film, and [Pocket](https://getpocket.com "Pocket") to save articles. Each of these services is then scraped by a script I wrote every hour or so. The full history of my activity in each service is formatted and uploaded to a small Postgres database hosted by [DigitalOcean](https://www.digitalocean.com/ "DigitalOcean").

This means I have a full, normalised record of all the media I’ve been consuming for at least two years. Not all of the scrapers are pretty, one relies on using Headless Chrome to download a .zip file from the GDPR compliance page of Letterboxd, for example. They do mean that I have an authoritative data source on what I’ve been up to, though. There is lots of prior art here from [beepb00p](https://beepb00p.xyz/hpi.html "beepb00p"), who has a very advanced personal digital life scraping and representation project. Mine differs in a lot of ways, primarily in scope, but also the fact that I commit the cardinal sin of throwing away the original data files as-delivered, and normalise to a database.

The managed hosting Postgres hosted by DigitalOcean is probably overkill. I use very little of the allocation and its the most expensive standing cost of all of it. I do have some exported data from old Facebook messages and Google location history sitting in there ready to be used for something. My hope is the expensive overhead will motivate me to tinker with the database to make it worth my while.

## Personal API

The [scraper scripts](https://github.com/JackWReid/jackreidapi/tree/master/scripts "scraper scripts"), [a simple API](https://github.com/JackWReid/jackreidapi/tree/master/api "a simple API") to access the stored personal data, and a small monitoring stack for these processes, all sit on a $10 DigitalOcean droplet running Docker. The API is an Express server in a Docker container; each of the scrapers is a run-once Docker container that writes straight to the remote DB, and [Grafana](https://grafana.com/ "Grafana") and [Prometheus](https://prometheus.io/ "Prometheus") each run in their own Docker containers to collect and display metrics. All of this runs with one Docker Compose file with very little strain on the host. [Caddy](https://caddyserver.com/ "Caddy") then reverse-proxies all of this to the public internet.

Of course the Docker host gets very little strain because the API gets about .5rps. Pretty much the only consumer of the API is another script that periodically calls it to update my website with new data.

This API allows me to call up the books I’m currently reading according to Goodreads:

```
GET https://api.jackreid.xyz/books/reading

[
  {
    "title": "Love of Country: A Hebridean Journey",
    "author": "Madeleine Bunting",
    "date_updated": "2020-05-05T12:13:25.000Z"
  },
  {
    "title": "The Power Broker: Robert Moses and the Fall of New York",
    "author": "Robert A. Caro",
    "date_updated": "2020-04-16T05:06:51.000Z"
  }
]
```

## Updating the website

Because [this website](https://github.com/JackWReid/jackreid.xyz "this website") is static, it won’t automatically call the API it renders a page. That’s good, because it means it can be nice and fast, but it means if I want it to show the latest in what I’m reading on the homepage I’ll have to regularly check for changes and re-build the site.

```
echo "[$(date)] Starting book and film data update"
git checkout -f;
git pull origin master;

# Download latest data from API
curl -Lk https://api.jackreid.xyz/books/reading?limit=5000 | jq . > $PWD/data/books/reading.json;
curl -Lk https://api.jackreid.xyz/books/toread?limit=5000 | jq . > $PWD/data/books/toread.json;
curl -Lk https://api.jackreid.xyz/books/read?limit=5000 | jq . > $PWD/data/books/read.json;

curl -Lk https://api.jackreid.xyz/films/watched?limit=5000 | jq . > $PWD/data/films/watched.json;
curl -Lk https://api.jackreid.xyz/films/towatch?limit=5000 | jq . > $PWD/data/films/towatch.json;

curl -Lk https://api.jackreid.xyz/pocket?limit=5000 | jq . > $PWD/data/pocket.json;
curl -Lk https://api.jackreid.xyz/articles?limit=5000 | jq . > $PWD/data/articles.json;

# Update git
echo "[$(date)] Committing updated media data files"
if [ -z "$(git status --porcelain)" ]; then
	echo "[$(date)] No changes found"
else
	echo "[$(date)] Changes found"
	git add . && git commit -m "[$(date)] Updated media data files" && git push origin master;
fi
```

The DigitalOcean droplet also has a clone of my website repo. A cron job regularly runs [the above script](https://github.com/JackWReid/jackreid.xyz/blob/master/scripts/update_media.sh "the above script") and calls all the relevant endpoints in my personal API, outputting the results into the `/data` directory of the Hugo site. If anything’s changed, it commits the updates to the data and pushes them so the updated version deploys. If not, do nothing.

In the end, a cron job is responsible for keeping all of this ticking. One task regularly makes sure the API and the scraper scripts are at the latest versions. Another runs all the scrapers that update the database every hour. Finally, one checks the API for new personal data and triggers the website to rebuild.

## Conclusion

All of this is horribly over-engineered, I know that. Really it’s a testing bed for me to try out things and to learn stuff I otherwise wouldn’t have to interact with as much: Docker, databases, monitoring stacks. The upside is I can have a nice and fast website that has all the latest information about what I’m watching. I’m leaning more and more into this retro-revival idea of having a single unified home online that represents me and that I am in control of, and this helps facilitate all of that.
