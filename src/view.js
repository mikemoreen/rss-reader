import { includes, find } from 'lodash';

const renderModal = (posts, viewedPosts) => {
  const postsContainer = document.querySelector('.posts');
  const buttons = postsContainer.querySelectorAll('button');

  const title = document.querySelector('.modal-title');
  const body = document.querySelector('.modal-body');
  const link = document.querySelector('.full-article');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const { id } = button.dataset;
      const post = find(posts, (obj) => obj.id === id);
      body.textContent = post.description;
      title.textContent = post.title;
      link.href = post.link;
      if (!includes(viewedPosts, post.title)) {
        viewedPosts.push(post.title);
      }
    });
  });
};

const renderPosts = (state, i18nextInstance) => {
  const { posts, viewedPosts } = state;
  // Заголовок
  const postsContainer = document.querySelector('.posts');
  postsContainer.innerHTML = '';
  const header = document.createElement('h2');
  header.textContent = i18nextInstance.t('posts');

  // Таблица с постами
  const ul = document.createElement('ul');
  ul.className = 'list-group';

  const postsHtml = posts.map((item) => `<li class="list-group-item d-flex justify-content-between">
        <a href=${item.link} target="_blank" class=${includes(viewedPosts, item.title) ? 'fw-normal' : 'fw-bold'}>${item.title}</a>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal" data-id=${item.id}>${i18nextInstance.t('button')}</button>
      </li>`);
  ul.innerHTML = postsHtml.join('');
  postsContainer.prepend(ul);
  postsContainer.prepend(header);
  renderModal(posts, viewedPosts);
};

const renderFeeds = (state, i18nextInstance) => {
  const arrayOfFeeds = state.feeds;
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = '';
  const header = document.createElement('h2');
  header.textContent = i18nextInstance.t('feeds');
  // Таблица с фидами
  const ul = document.createElement('ul');
  ul.className = 'list-group border-0 rounded-0';

  const feedsHtml = arrayOfFeeds.map((item) => `<li class="list-group-item border-0 border-end-0>
                <h3 class="h6 m-0">${item[0]}</h3>
                <p class="m-0 small text-black-50">${item[1]}</p>
            </li>`);
  ul.innerHTML = feedsHtml.join('');
  feedsContainer.prepend(ul);
  feedsContainer.prepend(header);
};

const renderForm = (state, status, i18nextInstance) => {
  const input = document.querySelector('input');
  const feedback = document.querySelector('.feedback');
  if (status === 'loading') {
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = 'Загрузка данных...';
    input.value = '';
    input.focus();
  }
  if (status === 'failed') {
    if (state.form.error === 'errors.duplicateUrl') {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance.t('errors.duplicateUrl');
      input.value = '';
      input.focus();
    }
    if (state.form.error === 'errors.incorrectUrl') {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance.t('errors.incorrectUrl');
      input.value = '';
      input.focus();
    }
    if (state.form.error === 'errors.networkError') {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance.t('errors.networkError');
      input.value = '';
      input.focus();
    }
    if (state.form.error === 'errors.parseError') {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance.t('errors.parseError');
      input.value = '';
      input.focus();
    }
    if (state.form.error === 'errors.unknown') {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance.t('errors.unknown');
      input.value = '';
      input.focus();
    }
  }

  if (status === 'loaded') {
    if (state.form.error === 'loading.success') {
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18nextInstance.t('loading.success');
      input.value = '';
      input.focus();
    }
  }
};
export { renderPosts, renderFeeds, renderForm };
