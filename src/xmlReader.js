export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml.data, 'application/xml');
  const title = doc.querySelector('channel > title');
  const description = doc.querySelector('channel > description');
  const items = doc.querySelectorAll('item');

  const articles = [].map.call(items, (item) => {
    const articleTitle = item.querySelector('title');
    const articleLink = item.querySelector('link');
    const articleDescription = item.querySelector('description');
    return {
      title: articleTitle ? articleTitle.textContent : '',
      link: articleLink ? articleLink.textContent.trim() : '',
      description: articleDescription ? articleDescription.textContent : '',
    };
  });

  return {
    title: {
      title: title ? title.textContent : '',
      description: description ? description.textContent : '',
    },
    articles,
  };
};
