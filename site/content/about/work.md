---
title: Work History
date: 2019-07-23T15:51:00+01:00
url: /work
layout: plain
draft: false
---

This is a brief overview of my work history in tech, covering the major projects at the companies I've worked at. The general outline of my work history is available on [LinkedIn](https://www.linkedin.com/in/jackwreid/) too, if that's more your thing. If you're more interested in what stuff I use while I'm at work, I have a [/uses](/uses) page. You can download my <a href="/docs/cv.pdf" download="cv.pdf">CV here</a>.

## BuzzFeed (2017-)
I work at BuzzFeed as an Engineering Manager. I've been on loads of different projects while I've been there so I'll just pick out a couple of interesting ones.

### People Management
Lately I've waded into people management as my main focus at work. It's different! I like it! I'm a few months into it at the point of writing, with a handful of reports. I don't have much to say about it yet, many words of wisdom other than to say I really like fighting for other peoples' interests.

### Internet Points
Internet Points is a feature I've been working on from the start. It's a way of rewarding our BuzzFeed Community users for the stuff they do on the site (did you know anybody can sign up and create a BuzzFeed quiz?).

When a user creates a post, for example, they are rewarded with points. Their points are displayed next to their username in their posts, on their profile, on leaderboard, and more. Building this system required tying together and simplifying a whole host of systems across BuzzFeed that are responsible for various user actions, then channeling those events into one system.

### Accessibility
Improving the accessibility of the BuzzFeed website is the biggest tech project I've undertaken. I've been coordinating to fix hundreds of issues big and small that stop users with accessibility needs from enjoying our site and content.

The project has involved working with external accessibility auditors and co-ordinating fixes across a large team of engineers. Some fixes have involved working across the tech organisation, with design and product, securing budget, and consulting legal counsel.

It's been incredibly involved, but I think it's some of the most important work in my career.

### BuzzFeed News
I joined BuzzFeed in great part because I've always been an admirer of the incredible journalism BuzzFeed News produces, so it was a huge honour to get to work on the rebrand and re-tooling of BuzzFeed News.

BuzzFeed News had long suffered from being mixed up with the less serious BuzzFeed brand, and its content being presented side by side with quizzes and meme roundups. This wasn't doing the journalism our reporters do justice. [BuzzFeed News](https://buzzfeednews.com) was going to get its own destination, it's own domain, and its own design.

We build buzzfeednews.com from the ground up, but in accordance with established patterns already used by BuzzFeed Tech. We worked very closely with stakeholders in the newsroom to get a very specific set of requirements.

One challenge particular to our news site is the highlighly configurable splash on the homepage. Our editors need to be able to respond to every kind of news day by configuring a very flexible hompage. So we gave them plenty of elements to play with: a breaking bar, a trending topics bar, and a splash with multiple layouts.

## Depop (2016-2017)
Depop was my first "real" job in tech! They took a chance on an a young guy with no Computer Science degree, and who'd been working as a freelance web developer for a couple of years. Depop is a marketplace for selling second-hand and vintage clothes and other style items. When I arrived, it was an iOS app with just a marketing website.

### The New [depop.com](https://depop.com)
My major project during my time at Depop was turning a static marketing site into a dynamiccatalog of the inventory of Depop's users.

In a front-end team of two, we built the new site from ground up as an isomorphic React application, backed by a GraphQL layer that connected to our preexisting service infrastructure. Up to that time the only consumers of those services had been the iOS app, so a lot of adaption had to take place in the GraphQL layer.

It was a really big learning curve for me as a junior front-end developer. We were using GraphQL when it was brand new, and hitting all the associated painpoints. We were managing a large isomorphic React codebase, styled with Glamor, really digging deep on the "back-end of the front-end".

### Staff Chat
Depop is both a community and a marketplace. Users sell their second-hand stuff to other users, and things go wrong in those transactions all the time. So there was a big Operations team who managed disputes, and trust and safety issues.

When I arrived at Depop, some of the tooling was severely lacking for these teams. For example, if they wanted to respond to users in the in-app chat function, they had to just use the normal iOS app on their phones. That got pretty unwieldy when they were speaking to hundreds of users. So I built a web client that used the pre-existing chat API, but that allowed reading and responding to messages in bulk in desktop web environment.

