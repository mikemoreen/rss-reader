const parse = (data) => {
  try {
    const parser = new DOMParser();
    const DOM = parser.parseFromString(data, 'text/xml');

    const channelTitle = DOM.querySelector('channel > title');
    const channelDescription = DOM.querySelector('channel > description');
    const items = [...DOM.querySelectorAll('item')]
      .map((item) => ({
        title: item.querySelector('title').textContent,
        link: item.querySelector('link').textContent,
        description: item.querySelector('description').textContent,
      }));
    return {
      title: channelTitle.textContent,
      description: channelDescription.textContent,
      posts: items,
    };
  } catch {
    const error = new Error("resource doesn't contain valid Rss");
    throw error;
  }
};
export default parse;
