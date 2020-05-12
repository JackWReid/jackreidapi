const API_FILE_TARGET =
  'https://api.github.com/repos/JackWReid/jackreidapi/contents/site/content/note/';

const formEl = document.querySelector('form');
const bodyEl = formEl.querySelector('#body');
const tokenEl = formEl.querySelector('#ghtoken');

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

function publishPost(filename, md) {
  const messageEl = document.querySelector('#submitmessage');
  const url = API_FILE_TARGET + filename;

  const payload = {
    message: `Shared note: ${filename}`,
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
    body: bodyEl.value,
  };

  const date = new Date().toISOString();
  const filename = `${date}.md`;

  const md = `
---
title: ${vals.body}
date: ${date}
---
  `;

  publishPost(filename, md);
}
