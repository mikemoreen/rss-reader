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
  // buttons.forEach((button) => {
  //   button.addEventListener('click', () => {
  //     console.log(button)
  //     const { id } = button.dataset;
  //     const post = find(posts, (obj) => obj.id === id);
  //     body.textContent = post.description;
  //     title.textContent = post.title;
  //     link.href = post.link;
  //     if (!includes(viewedPosts, post.title)) {
  //       viewedPosts.push(post.title);
  //     }
  //   });
  // });
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
  const { input, feedback } = elements;

  if (state.form.status === 'loading') {
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = 'Загрузка данных...';
    input.value = '';
    input.focus();
  }
  if (state.form.status === 'failed') {
    if (state.form.error === 'errors.duplicateUrl') {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance('errors.duplicateUrl');
      input.value = '';
      input.focus();
    }
    if (state.form.error === 'errors.incorrectUrl') {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance('errors.incorrectUrl');
      input.value = '';
      input.focus();
    }
    if (state.form.error === 'errors.networkError') {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance('errors.networkError');
      input.value = '';
      input.focus();
    }
    if (state.form.error === 'errors.parseError') {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance('errors.parseError');
      input.value = '';
      input.focus();
    }
    if (state.form.error === 'errors.unknown') {
      input.classList.add('is-invalid');
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nextInstance('errors.unknown');
      input.value = '';
      input.focus();
    }
  }

  if (state.form.status === 'loaded') {
    if (state.form.error === 'loading.success') {
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18nextInstance('loading.success');
      input.value = '';
      input.focus();
    }
  }
};
export { renderPosts, renderFeeds, renderForm };
