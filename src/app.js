/* eslint-disable no-param-reassign */
import axios from 'axios';
import onChange from 'on-change';
import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import parse from './parser.js';
import { renderPosts, renderFeeds, renderForm } from './view.js';
import ru from './locales/ru.js';

const timeToUpdatePosts = 4000;

const setId = (posts) => {
  const postsWithId = posts.map((post) => {
    post.id = _.uniqueId();
    return post;
  });
  return postsWithId;
};

const addProxy = (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';
  return new URL(`${proxy}${url}`);
};

const generateErrorMessage = (error, watcherState) => {
  if (axios.isAxiosError(error)) {
    watcherState.form.error = 'errors.networkError';
  } else if (error === "resource doesn't contain valid Rss") {
    watcherState.form.error = 'errors.parseError';
  } else {
    watcherState.form.error = 'errors.unknown';
  }
  watcherState.form.status = 'failed';
};

const validate = (url) => {
  const urlSchema = yup
    .string('notString')
    .url('notUrl')
    .required('');
  try {
    urlSchema.validateSync(url);
    return null;
  } catch (err) {
    return err.message;
  }
};
const addPost = (state, contents) => {
  const dataFromRss = parse(contents);
  const { title, description, posts } = dataFromRss;
  const allPosts = [...posts, ...state.posts];
  const postsWithId = setId(allPosts);
  state.posts = postsWithId;
  const allFeeds = [[title, description], ...state.feeds];
  state.feeds = allFeeds;
};

const updatePosts = (state, watcherState) => {
  const urls = state.form.urls;
  if (state.form.urls.length === 0) {
    return;
  }
  const promises = urls.map((url) => axios.get(addProxy(url))
    .then((response) => response.data.contents)
    .then((contents) => {
      const dataFromRss = parse(contents);
      const newPostsFromRss = dataFromRss.posts;
      const newPostsFromRssWithId = setId(newPostsFromRss);
      return newPostsFromRssWithId;
    }));
  Promise.all(promises)
    .then((arrayOfNewPosts) => _.flatten(arrayOfNewPosts))
    .then((array) => {
      watcherState.posts = _.reverse(array);
    })
    .finally(() => setTimeout(() => updatePosts(state, watcherState), timeToUpdatePosts));
};

const app = (i18nextInstance) => {
  const state = {
    feeds: [],
    posts: [],
    viewedPosts: [],
    form: {
      urls: [],
      status: 'filling',
      error: '',
    },
  };
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    title: document.querySelector('.modal-title'),
    body: document.querySelector('.modal-body'),
    link: document.querySelector('.full-article'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    feedback: document.querySelector('.feedback'),
  };
  const watcherState = onChange(state, (path, value) => {
    if (path === 'form.status' && value === 'loaded') {
      renderForm(state, elements, i18nextInstance);
      renderFeeds(state, elements, i18nextInstance);
      renderPosts(state, elements, i18nextInstance);
    }
    if (path === 'form.status' && value === 'loading') {
      renderForm(state, elements, i18nextInstance);
    }
    if (path === 'form.status' && value === 'failed') {
      renderForm(state, elements, i18nextInstance);
    }
    if (path === 'posts') {
      renderPosts(state, elements, i18nextInstance);
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = elements.input.value;
    const resultOfValidation = validate(url);
    watcherState.form.status = 'loading';

    if (state.form.urls.includes(url)) {
      watcherState.form.error = 'errors.duplicateUrl';
      watcherState.form.status = 'failed';
    } else if (resultOfValidation === 'notUrl') {
      watcherState.form.error = 'errors.incorrectUrl';
      watcherState.form.status = 'failed';
    } else if (resultOfValidation === null) {
      watcherState.form.urls.push(url);
      axios.get(addProxy(url))
        .then((response) => response.data.contents)
        .then((contents) => {
          addPost(state, contents);
          watcherState.form.error = 'loading.success';
          watcherState.form.status = 'loaded';
          setTimeout(() => updatePosts(state, watcherState), 4000);
        }).catch((error) => {
          generateErrorMessage(error, watcherState);
        });
    }
  });
};
const runApp = async () => {
  const i18nextIn = i18next.createInstance();

  return i18nextIn.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
    .then((t) => {
      app(t);
    });
};
export default runApp;
