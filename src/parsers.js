const getFeedData = (xmlDOM) => {
  const title = xmlDOM.querySelector('channel > title');
  const description = xmlDOM.querySelector('channel > description');
  const items = xmlDOM.querySelectorAll('item');
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
    title: title ? title.textContent : '',
    description: description ? description.textContent : '',
    articles,
  };
};

export default getFeedData;
