const parse = (data) => {
  
    const parser = new DOMParser();
    const DOM = parser.parseFromString(data, 'text/xml');
    const parseError = DOM.querySelector('parsererror');
    if (parseError) {
      const error = new Error(parseError.textContent);
      error.isParseError = true;
      throw error;
    }
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
     
};
export default parse;
