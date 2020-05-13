const API_FILE_TARGET =
  'https://api.github.com/repos/JackWReid/jackreidapi/contents/site/content/link/';

const formEl = document.querySelector('form');
const titleEl = formEl.querySelector('#title');
const linkEl = formEl.querySelector('#link');
const slugEl = formEl.querySelector('#slug');
const tokenEl = formEl.querySelector('#ghtoken');

const params = parseQs(location.search.split('?')[1]);

const sanitize = str => {
  // replace endash and emdash with hyphens
  str = str.replace(/–/g, '');
  str = str.replace(/—/g, '-');

  // replace double quotes and apostrophes
  str = str.replace(/"/g, "'");
  str = str.replace(/“/g, "'");
  str = str.replace(/”/g, "'");
  str = str.replace(/’/g, "'");

  return str.trim();
};

function parseQs(qs) {
  const params = {};

  if (!qs) {
    return params;
  }

  const queries = qs.split('&');

  for (let i = 0; i < queries.length; i++) {
    let temp = queries[i].split('=');
    params[temp[0]] = temp[1];
  }

  return params;
}

function publishPost(filename, md) {
  const messageEl = document.querySelector('#submitmessage');
  const url = API_FILE_TARGET + filename;

  const payload = {
    message: `Shared link: ${filename}`,
    content: btoa(sanitize(md)),
    committer: {
      name: 'Jack Reid',
      email: 'hello@jackreid.xyz',
    },
  };

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/vnd.github.v3+json',
      Authorization: `token ${tokenEl.value}`,
    },
    body: JSON.stringify(payload),
  };

  messageEl.innerText = 'Loading...';
  fetch(url, options).then(response => {
    if (response.ok) {
      messageEl.innerText = 'Submitted!';
    } else {
      messageEl.innerText = 'Failed!';
    }
  });
}

function onSubmit(e) {
  e.preventDefault();

  const vals = {
    title: titleEl.value,
    slug: slugEl.value,
    link: params.url,
  };

  const date = new Date().toISOString();
  const filename = `${vals.slug}.md`;

  const md = `
---
title: ${sanitize(vals.title)}\nslug: ${vals.slug}\nlink: ${vals.link}\ndate: ${date}\ntags:
---

${vals.body}
  `;

  publishPost(filename, md);
}

function prefill() {
  if (params.title) {
    titleEl.value = decodeURIComponent(params.title);
  }

  if (params.url) {
    linkEl.value = decodeURIComponent(params.url);
  }
  const preToken = localStorage.getItem('ght');
  if (preToken) {
    tokenEl.value = preToken;
  }
}

prefill();
