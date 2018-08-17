import $ from 'jquery';
import getFeedData from './xmlReader';

const buildDescriptionHtml = (state) => {
  const descriptionItemsHtml = state.docs.map((el) => {
    const titleDescriptionArticleData = getFeedData(el);
    const divItem = document.createElement('div');
    const title = document.createElement('h2');
    title.innerHTML = titleDescriptionArticleData.title;
    const description = document.createElement('p');
    description.innerHTML = titleDescriptionArticleData.description;
    divItem.appendChild(title);
    divItem.appendChild(description);
    return divItem;
  });
  return descriptionItemsHtml;
};

const buildListItem = (item) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  li.classList.add('mt-1');
  a.innerHTML = item.title;
  a.href = item.link;
  li.appendChild(a);
  const button = document.createElement('button');
  button.innerHTML = 'Description';
  button.classList.add('btn', 'btn-primary', 'btn-sm', 'ml-2');
  button.type = 'button';
  button.dataset.toggle = 'modal';
  button.dataset.target = '#descriptionModal';
  button.addEventListener('click', () => {
    const $el = $('#modalBody');
    $el.html(item.description);
  });
  li.appendChild(button);

  return li;
};

const buildArticlesHtml = (state) => {
  const list = document.createElement('ul');
  state.articlesAllFlat.forEach((item) => {
    const li = buildListItem(item);
    list.appendChild(li);
  });
  return list;
};

export const renderDescription = (state) => {
  const $el = $('#description');
  const value = buildDescriptionHtml(state);
  $el.html(value);
};

export const renderArticlesList = (state) => {
  const $el = $('#articles');
  const value = buildArticlesHtml(state);
  $el.html(value);
};
