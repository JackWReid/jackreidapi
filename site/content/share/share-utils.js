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

const findBtoaError = string => {
  const charArr = string.split('');
  charArr.forEach(c => {
    try {
      btoa(c); 
    } catch (e) {
      console.error(`Choked on base64 for '${c}'`);
    }
  });
};

const fileUrl = (contentType, slug) => {
  if (contentType === 'note') {
    return apiPath(contentType) + dateTimeString() + '.md';
  }

  if (contentType === 'link') {
    return apiPath(contentType) + dateTimeString() + '.md';
  }

  if (contentType === 'highlight') {
    return apiPath(contentType) + dateString() + '-' + slug.value + '.md';
  }

  if (contentType === 'post') {
    return apiPath(contentType) + dateString() + '-' + slug.value + '.md';
  }

  throw new Error(`Unrecognised content type (${contentType, slug.value}), could not create file URL`);
};

function getByteLength(normal_val) {
  normal_val = String(normal_val);

  var byteLen = 0;
  for (var i = 0; i < normal_val.length; i++) {
    var c = normal_val.charCodeAt(i);
    byteLen +=
      c < 1 << 7
        ? 1
        : c < 1 << 11
          ? 2
          : c < 1 << 16
            ? 3
            : c < 1 << 21
              ? 4
              : c < 1 << 26
                ? 5
                : c < 1 << 31
                  ? 6
                  : Number.NaN;
  }
  return byteLen;
}

const filterBadChars = string =>
  string
    .replace(/’/g, '\'')
    .split('')
    .filter(c => getByteLength(c) === 1)
    .join('');

async function publishToApi({contentType, bodyString, token, slug}) {
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

const tagList = tags =>
  tags
    .replace(/ /g, '')
    .split(',')
    .map(t => `- ${t}`)
    .join('\n');

const titleEscape = title => title.replace(/"/g, "'");

function createFileBody({contentType, vals}) {
  const titleString = contentType === 'note' ? vals.body : vals.title;

  let fileString = `---
title: "${titleString}"
date: ${isoDateString()}\n`;

  if (contentType === 'link') {
    fileString = fileString.concat(`link: "${vals.link}"\n`);
  }

  if (['highlight', 'post'].includes(contentType)) {
    fileString = fileString.concat(`slug: ${vals.slug}\n`);
    fileString = fileString.concat(`tags:\n${tagList(vals.tags)}\n`);
  }

  fileString = fileString.concat('---\n\n');

  if (['highlight', 'post', 'journal'].includes(contentType)) {
    fileString = fileString.concat(vals.body);
  }

  findBtoaError(fileString);
  return btoa(fileString);
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
  if (status === 'error') {
    console.error(message);
  }

  const hookEl = document.querySelector('.share-form__report-wrapper');
  const reportEl = document.createElement('pre');
  reportEl.classList.add('share-form__report');
  reportEl.classList.add(`share-form__report--${status}`);
  reportEl.innerText = message;
  hookEl.innerHTML = '';
  hookEl.appendChild(reportEl);
}

function onFormSubmit(event) {
  event.preventDefault();
  const contentType = location.pathname.split('/')[2];

  const titleEl = formEl.querySelector('#title');
  const bodyEl = formEl.querySelector('#body');
  const linkEl = formEl.querySelector('#link');
  const slugEl = formEl.querySelector('#slug');
  const tagsEl = formEl.querySelector('#tags');
  const tokenEl = formEl.querySelector('#ghtoken');
  const token = tokenEl.value;

  const vals = {
    title: titleEl && titleEl.value,
    body: bodyEl && bodyEl.value,
    link: linkEl && linkEl.value,
    slug: slugEl && slugEl.value,
    tags: tagsEl && tagsEl.value,
  };

  const fileBody = createFileBody({contentType, vals});
  const bodyString = createGitHubPayload({contentType, fileBody});

  reportStack('LOADING', 'loading');
  publishToApi({contentType, bodyString, token, slug: vals.slug})
    .then(() => reportStack(`SUCCESS\n${bodyString}`, 'success'))
    .catch(error => reportStack(error, 'error'));
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

function prefillContentFields() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {
    title: urlParams.get('title'),
    url: urlParams.get('url'),
    body: urlParams.get('body'),
  };

  const titleEl = formEl.querySelector('#title') || {};
  const linkEl = formEl.querySelector('#link') || {};
  const bodyEl = formEl.querySelector('#body') || {};

  if (params.title) {
    titleEl.value = decodeURIComponent(params.title);
  }

  if (params.url) {
    linkEl.value = decodeURIComponent(params.url);
  }

  if (params.body && params.url) {
    bodyEl.value = `> ${decodeURIComponent(params.body)}

&mdash; [${decodeURIComponent(params.title)}](${decodeURIComponent(
      params.url,
    )})`;
  }
}

prefillTokenField();
prefillContentFields();
attachCharFilterHandlers();
