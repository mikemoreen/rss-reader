import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import onChange from 'on-change';
import * as yup from 'yup';
import _ from 'lodash';
import bootstrap from 'bootstrap';
import i18next from 'i18next';
import parse from './parser';
import { renderPosts, renderFeeds, renderForm } from './view';
import ru from './locales/ru';

const proxy = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';

const setId = (posts) => {
  const postsWithId = posts.map((post) => {
    post.id = _.uniqueId();
    return post;
  });
  return postsWithId;
};

const outputError = (error, watcherState) => {
  if (axios.isAxiosError(error)) {
    watcherState.form.error = 'errors.networkError';
  } else if (error === 'parse error') {
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
const updatePosts = (state, watcherState) => {
  const urls = state.form.uploadedUrls.slice().reverse();
  if (state.form.uploadedUrls.length === 0) {
    return;
  }
  const promises = urls.map((url) => axios.get(`${proxy}${encodeURIComponent(url)}`)
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
      watcherState.posts = array;
    })
    .catch((error) => {
      outputError(error, watcherState);
    })
    .finally(() => setTimeout(() => updatePosts(state, watcherState), 4000));
};

const app = (i18nextInstance) => {
  const state = {
    feeds: [],
    posts: [],
    viewedPosts: [],
    form: {
      uploadedUrls: [],
      status: 'filling',
      error: '',
    },
  };
  const watcherState = onChange(state, (path, value) => {
    if (path === 'form.status' && value === 'loaded') {
      renderForm(state, value, i18nextInstance);
      renderFeeds(state, i18nextInstance);
      renderPosts(state, i18nextInstance);
    }
    if (path === 'form.status' && value === 'loading') {
      renderForm(state, value);
    }
    if (path === 'form.status' && value === 'failed') {
      renderForm(state, value, i18nextInstance);
    }
    if (path === 'posts') {
      renderPosts(state, i18nextInstance);
    }
  });

  const input = document.querySelector('input');
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = input.value;
    const resultOfValidation = validate(url);
    watcherState.form.status = 'loading';

    if (state.form.uploadedUrls.includes(url)) {
      watcherState.form.error = 'errors.duplicateUrl';
      watcherState.form.status = 'failed';
    } else if (resultOfValidation === 'notUrl') {
      watcherState.form.error = 'errors.incorrectUrl';
      watcherState.form.status = 'failed';
    } else if (resultOfValidation === null) {
      watcherState.form.uploadedUrls.push(url);
      axios.get(`${proxy}${encodeURIComponent(url)}`)
        .then((response) => response.data.contents)
        .then((contents) => {
          const dataFromRss = parse(contents);
          const { title, description, posts } = dataFromRss;
          // Посты
          const allPosts = [...posts, ...state.posts];
          const postsWithId = setId(allPosts);
          state.posts = postsWithId;
          // Фиды
          const allFeeds = [[title, description], ...state.feeds];
          state.feeds = allFeeds;
          watcherState.form.error = 'loading.success';
          watcherState.form.status = 'loaded';
          setTimeout(() => updatePosts(state, watcherState), 2000);
        }).catch((error) => {
          outputError(error, watcherState);
        });
    }
  });
};
const runApp = async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  app(i18nextInstance);
};
export default runApp;
