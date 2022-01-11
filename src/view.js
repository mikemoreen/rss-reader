import { includes } from 'lodash';

const renderPosts = (state, elements, i18nextInstance) => {
  const { posts, viewedPosts } = state;
  const postsContainer = elements.posts;
  const header = document.createElement('h2');
  const ul = document.createElement('ul');

  postsContainer.innerHTML = '';
  header.textContent = i18nextInstance('posts');
  ul.className = 'list-group';

  const postsHtml = posts.map((item) => `<li class="list-group-item d-flex justify-content-between">
        <a href=${item.link} target="_blank" class=${includes(viewedPosts, item.title) ? 'fw-normal' : 'fw-bold'}>${item.title}</a>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal" data-id=${item.id}>${i18nextInstance('button')}</button>
      </li>`);
  ul.innerHTML = postsHtml.join('');
  postsContainer.prepend(ul);
  postsContainer.prepend(header);

  const { title, body, link } = elements;

  postsContainer.addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    const post = posts.find((obj) => obj.id === id);
    if (!post) {
      return;
    }
    body.textContent = post.description;
    title.textContent = post.title;
    link.href = post.link;
    if (!includes(viewedPosts, post.title)) {
      viewedPosts.push(post.title);
      renderPosts(state, elements, i18nextInstance);
    }
  });
};

const renderFeeds = (state, elements, i18nextInstance) => {
  const arrayOfFeeds = state.feeds;
  const feedsContainer = elements.feeds;
  const header = document.createElement('h2');
  const ul = document.createElement('ul');

  feedsContainer.innerHTML = '';
  header.textContent = i18nextInstance('feeds');
  ul.className = 'list-group border-0 rounded-0';

  const feedsHtml = arrayOfFeeds.map((item) => `<li class="list-group-item border-0 border-end-0>
                <h3 class="h6 m-0">${item[0]}</h3>
                <p class="m-0 small text-black-50">${item[1]}</p>
            </li>`);
  ul.innerHTML = feedsHtml.join('');
  feedsContainer.prepend(ul);
  feedsContainer.prepend(header);
};

const renderForm = (state, elements, i18nextInstance) => {
  const { input, feedback, button } = elements;
  const { status, error } = state.form;
  const formErrors = {
    'errors.duplicateUrl': i18nextInstance('errors.duplicateUrl'),
    'errors.incorrectUrl': i18nextInstance('errors.incorrectUrl'),
    'errors.networkError': i18nextInstance('errors.networkError'),
    'errors.parseError': i18nextInstance('errors.parseError'),
    'errors.unknown': i18nextInstance('errors.unknown'),
    'loading.success': i18nextInstance('loading.success'),
  };
  if (status === 'loading') {
    button.setAttribute('disabled', 'disabled');
    input.setAttribute('readonly', true);
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = 'Загрузка данных...';
  }
  if (status === 'failed') {
    button.removeAttribute('disabled');
    input.removeAttribute('readonly');
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = formErrors[error];
  }

  if (status === 'loaded') {
    button.removeAttribute('disabled');
    input.removeAttribute('readonly');
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = formErrors[error];
  }
  input.value = '';
  input.focus();
};
export { renderPosts, renderFeeds, renderForm };
