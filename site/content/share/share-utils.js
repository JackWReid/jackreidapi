const apiPath = contentType =>
  `https://api.github.com/repos/JackWReid/jackreidapi/contents/site/content/${contentType}/`;

const isoDateString = () => new Date().toISOString();

const dateTimeString = () =>
  new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/:/g, '-');

const dateString = () => new Date().toISOString().slice(0, 10);

const formEl = document.querySelector('.share-form');

const fileUrl = (contentType, slug) => {
  if (contentType === 'note') {
    return apiPath(contentType) + dateTimeString();
  }

  if (contentType === 'link') {
    return apiPath(contentType) + dateTimeString();
  }

  if (contentType === 'highlight') {
    return apiPath(contentType) + dateString() + '-' + slug;
  }

  if (contentType === 'post') {
    return apiPath(contentType) + dateString() + '-' + slug;
  }

  throw new Error('Unrecognised content type, could not create file URL');
};

function getByteLength(normal_val) {
  normal_val = String(normal_val);

  var byteLen = 0;
  for (var i = 0; i < normal_val.length; i++) {
    var c = normal_val.charCodeAt(i);
    byteLen +=  c < (1 <<  7) ? 1 :
      c < (1 << 11) ? 2 :
      c < (1 << 16) ? 3 :
      c < (1 << 21) ? 4 :
      c < (1 << 26) ? 5 :
      c < (1 << 31) ? 6 : Number.NaN;
  }
  return byteLen;
} 

const filterBadChars = string => string.split('').filter(c => getByteLength(c) === 1).join('');

async function publishToApi({contentType, bodyString, slug, token}) {
  const requestUrl = fileUrl(contentType, slug);

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
    },
    body: bodyString,
  };

  try {
    const response = await fetch(requestUrl, options);
    if (!response.ok) {
      throw Error(`${response.status}: ${response.statusText}`);
    }
    return;
  } catch (error) {
    throw Error(`Failed to send to GitHub API \n${error}`);
  }
}

function createFileBody({contentType, vals}) {
  const md = `
---
title: ${vals.body}
date: ${isoDateString()}
---
  `;

  return btoa(md);
}

function createGitHubPayload({contentType, fileBody}) {
  return JSON.stringify({
    message: `[${isoDateString()}] Shared ${contentType}`,
    content: fileBody,
    committer: {
      name: 'Jack Reid',
      email: 'hello@jackreid.xyz',
    },
  });
}

function reportStack(message, status) {
  const hookEl = document.querySelector('.share-form__report-wrapper');
  const reportEl = document.createElement('pre');
  reportEl.classList.add('share-form__report');
  reportEl.classList.add(`share-form__report--${status}`);
  reportEl.innerText = message;
  hookEl.innerHTML = '';
  hookEl.appendChild(reportEl);
}

async function onFormSubmit(event) {
  event.preventDefault();
  const contentType = 'note';
  const bodyEl = formEl.querySelector('#body');
  const tokenEl = formEl.querySelector('#ghtoken');
  const token = tokenEl.value;

  const vals = {
    body: bodyEl.value,
  }

  const fileBody = createFileBody({contentType, vals});
  const bodyString = createGitHubPayload({contentType, fileBody});
  try {
    reportStack('LOADING', 'loading');
    await publishToApi({contentType, bodyString, token});
    reportStack(`SUCCESS\n${bodyString}`, 'success');
  } catch (error) {
    reportStack(error, 'error');
  }
}

function prefillTokenField() {
  const tokenEl = formEl.querySelector('#ghtoken');
  const preToken = localStorage.getItem('ght');
  tokenEl.value = preToken;
}

function filterCharHandler(event) {
  const el = event.target;
  const preVal = event.target.value;
  const filtered = filterBadChars(preVal);
  el.value = filtered;
}

function attachCharFilterHandlers() {
  const fields = document.querySelectorAll('[data-filter-char]');
  fields.forEach(f => f.addEventListener('keyup', filterCharHandler));
}

prefillTokenField();
attachCharFilterHandlers();
