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

  // kill any non ascii
  str = str.replace(/[^\x00-\x7F]/g, "");

  return str.trim();
};

function publishPost(payload) {
  const date = new Date().toISOString();
  const messageEl = document.querySelector('#submitmessage');
  const url = API_FILE_TARGET + `${date}.md`;

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
      localStorage.setItem('ght', tokenEl.value);
      window.location = 'https://jackreid.xyz';
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

  const md = `
---
title: ${vals.body}
date: ${date}
---
  `;

  const sanitizedContent = sanitize(md);
  const content = btoa(sanitizedContent);

  const payload = {
    message: `Shared note: ${date}.md`,
    content,
    committer: {
      name: 'Jack Reid',
      email: 'hello@jackreid.xyz',
    },
  };


  publishPost(payload);
}

function prefill() {
  const preToken = localStorage.getItem('ght');
  if (preToken) {
    tokenEl.value = preToken;
  }
}

prefill();
