---
title: Media Diet
date: 2020-01-28T16:14:10
layout: plain
draft: false
---

I'm interested in taking media seriously. We're a culture of texts and basically all I (or most people I know) do is exchange pieces of text — be they book, article, movie, television that we like back and forth. We meet up and swap lists of recommendations. Partly just as an exercise in curiosity and partly as a practical tool I starting tracking these things.

I've been trying to keep a track what I've been reading and watching. I'm trying not to make it an exercise in consuming *as much as possible all the time*, but rather using it as a reference for when people ask what I've been reading or watching recently. Also at some point in the future it'd be nice to be able to look back on the books, movies, and TV that were floating around at the moment.

Getting all this information without too much effort and data entry has been a bit of a journey. Information about books is all scraped from my Goodreads, which I can update easily from my phone and where a lot of my friends share their reading too. Film and TV is on Letterboxd, which way fewer people use but is equally easy to update from my phone. Articles that I've saved and liked come from Pocket and Feedbin, respectively. All of this is scraped on an hourly cron job, normalised, and dropped into a database that I hope to keep adding to. I wrote a couple of posts about how this website and the surrounding media scraping infrastructure is built: [part one](/post/how-this-site-works/), [part two](/post/getting-off-of-netlify/).

<dl class="media-diet-nav">
  <div class="media-diet-nav__item">
    <dt><a href="/highlight">Highlights</a></dt>
    <dd>When I read articles online I clip the interesting parts of good ones and post them here with a link back to the article.</dd>
  </div>
  <div class="media-diet-nav__item">
    <dt><a href="/articles/saved">Saved Articles</a></dt>
    <dd>I use Pocket all day to save articles from Twitter and RSS to read later. I mirror that read queue here.</dd>
  </div>
  <div class="media-diet-nav__item">
    <dt><a href="/links">Links</a></dt>
    <dd>I'm keeping a collection of interesting websites here. I'm talking websites as in tools, blogs, and experiments rather than individual articles.</dd>
  </div>
  <div class="media-diet-nav__item">
    <dt>Books (<a href="/books/read">Past</a>, <a href="/books/reading">Present</a>, <a href="/books/toread">Future</a>)</dt>
    <dd>I track the books I'm reading through Goodreads, which I've mirrored here.</dd>
  </div>
  <div class="media-diet-nav__item">
    <dt>Films (<a href="/films/watched">Past</a>, <a href="/films/towatch">Future</a>)</dt>
    <dd>I track the films I'm watching through Letterboxd, which is also mirrored here.</dd>
  </div>
</dl>
