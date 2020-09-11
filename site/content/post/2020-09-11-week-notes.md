---
title: "Week Notes - 7th September 2020"
date: 2020-09-11T10:15:28+01:00
draft: false
tags:
  - media
---

Ideally all the books in the API should stay in the store even if they haven’t been included on any of the named shelves in the last Goodreads scrape. When a new scrape is run it would add any books that don’t appear, shift any books that are in the store but don’t appear in the latest scrape to a no-shelf status (representing books I know about but have no relation with, I guess). All of that is much easier if Goodreads has a persisting book ID. If the data persists I can add my own columns to the data too, like whether I own the books.

---

You could create a hardened set of API/website management scripts (scraping, building, adding new posts manually) and put them right in `/usr/local/bin`\*, which is where the cron jobs and SSH-from-iPhone would access them from. 

- **Pros:** Faster to run quick jobs
- **Cons:** Moves the scripts out of version control

It’s probably also worth having a `$SITEDIR` variable that all the scripts use.

Among these scripts could be a health check that runs on SSH-ing in. I would tell you:
- How many failed SSH attempts did we see today
- How many `postgresql` connections have we seen today
- Health check the website with a parsed `curl`
- Health check the API the same way
- The number of various kinds of media in the database

\* **`/usr/local/bin`**
I think that’s the right `bin` for my scripts. There’s a `man` page about what all the system directories are for: `man hier`.

---

I’d like to not have to completely delete and re-insert all my media records every time I scrape the sources (Goodreads, Letterboxd, etc). On a related note I’d like to have a record of books beyond ones that have a status right now.

The Goodreads exporter I use produces a books table that is only connected to status through other relations. If I can trust Goodreads book IDs for books to persist then I can only `INSERT`/`UPDATE` on the books table and then create a series of updates to update my status in relation to those books via the `reviews` table.

All of this amounts to a messy synchronisation with Goodreads, it’s exactly the kind of thing [`karlicoss`](https://beepb00p.xyz/sad-infra.html#exports_are_hard) was warning against when he said just to store the raw exports and map over them in a data access layer.

---

The `unison` file sync tool would be an improvement on one-way `rsync`. It is intended for two way replication but could support more than one laptop by using a star topology. Only one client syncs with the source-of-truth on a server at once.

---

`percollate` is a nice command-line to turn web pages into very readable documents for Kindle (`epub`, `mobi`, `pdf`). [Link here](https://github.com/danburzo/percollate).

---

I wanted to use some site admin scripts I’ve written in Bash as part of a cron job that keeps my site up to date. The scripts live inside the repository/directory the whole site and underlying API is stored in. To access them in the user `$PATH` I’ve symlinked them like:

{{< highlight plain >}}
/usr/local/bin/jbuild
->
/home/jack/server/jackreidapi/scripts/build_site.sh
{{< /highlight >}}

So I thought I’d have a really simple cron job because the command would be in the `$PATH`:

{{< highlight plain >}}
* * * * * jbuild
{{< /highlight >}}

However, if you echo `$PATH` from a test cron job, all it has in there is `/bin:/usr/bin`? I’ve added them to the `$PATH` at the beginning of each script but it’s a lame amount of boilerplate.

---

Let’s not forget about the costume party for **pub names**. Dress as the name of your favourite pub.

Weird pub names date back to when much of society was illiterate and pubs would use painted signs of known symbols to be identified by their illiterate patrons. They would even hang a found object outside: a boot or copper kettle.

---

**Gravitricity** is a company trying to solve the problem of spiky power production coming from renewable sources of energy. Right now many grids use big batteries to build up a buffer to supply smooth power. But batteries are expensive and they degrade.

Instead, they propose a deep shaft in which a large weight is suspended on cables, themselves driven by winches. To charge the system the winches are powered to raise the weight in the shaft, which creates potential energy. To discharge the system the weight is dropped and the cables run through the winches, which now act as generators. They’re building a live demonstration in Scotland that will be connected to the live grid.

---

I’ve gone off using my big DSLR because it’s just too heavy for me to carry around every day. That means I’m never going to use it get quick photos when I’m going about my day, which means any photo-taking habit I’d formed is gone. I miss it, and would like to have fun taking photos again. I’ve looked at the Fujifilm X100 cameras, which are portable enough to take on trips and toss in my day bag, but I don’t think I’m ready to drop £1000+. For now I’ve swapped the Canon EOS 7D body for a lighter EOS 1000F film body, but the lens is still really heavy. Film photographs should hopefully feel for a while, though.

---

A couple of games are playing with **non-euclidian geometry**, in which parallel lines don’t stay a fixed distance apart and the shortest line between two points isn’t straight. Examples are **Antichamber**, which has Escher-like impossible stair puzzles and like, and **Superliminal**, which uses forced perspective to allow objects to be made arbitrary sizes.

---

In **The Calling of St. Matthew** by Caravaggio, the contrast from the light is extreme. It is a form of chiaroscuro called tenebrism (from Italian tenebroso "dark, gloomy, mysterious”). It allows the artist to present the subjects on a flat, plain, or dark background while maintaining a real sense of depth and realism.

Caravaggio was painting while the Catholic Counter-Reformation was taking place. These paintings were useful to the church because of the simplicity of the scenes, and the artist’s use of real models, the scenes are rendered to be very real and relatable.

In **The Calling of St. Matthew**, which tells the story from Matthew 9:9 in which Jesus comes to a money lending house and calls Matthew to follow him. In the bible it sounds as if Matthew simply obeys right away and gets up to follow him. In the painting,  the very real-looking Matthew is over his work table looking surprised, confused, conflicted.

The bold lighting comes down in a golden-hour shaft and highlights Matthew against the background, which is almost black (like in many of his paintings).

Source: Evan Puschak’s video “[Caravaggio, Master Of Light](https://www.youtube.com/watch?v=R1lcb_7gj5k)”.

---

I don’t think I actually do want to be as informed as possible?

---

In an edition of Anne Helen Peterson’s culture newsletter, she discusses the increasingly dystopian setting in the US, on the day of Orange San Francisco (wildfire smoke from fires all over the west coast blotting out the sun and casting a deep orange shadow on everything). She recalls an interview with Alfonso Cuarón about the set design of **Children of Men**. He wanted a world that looks like we’d gone a decade past our current moment and just _stopped_. Lately, “the uncanniness is overwhelming”.

---

> Keep your distance. But stay close.

— gotyourback.space (backgrounds for Zoom calls by artists)

---

> What we did: love. We did not spend our days gazing into each other’s eyes. We did that gazing when we made love or one of us was in trouble, but most of the time our gazes met and entwined as they looked at  a third thing. Third things are essential to marriages. Objects or practices or habits or arts or institutions or games or human beings that provide a site of joint rapture or entertainment. Each member of a couple of is separate; the two come together in double attention.

— **[The Third Thing](https://www.poetryfoundation.org/poetrymagazine/articles/60484/the-third-thing)** by Donald Hall
