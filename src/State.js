export default class {
    input = '';

    isInputValid = true;

    urls = [];

    titles = [];

    articles = [];

    isRegularUpdateOn = false;

    setInput(newInput) {
      this.input = newInput;
    }

    setIsInputValid(newState) {
      this.isInputValid = newState;
    }

    addNewUrl(newUrls) {
      this.urls.push(newUrls);
    }

    addNewTitle(newTitle) {
      this.titles.push(newTitle);
    }

    addNewArticles(newArticles) {
      this.articles = [...newArticles, ...this.articles];
    }

    switchOnRegularUpdate() {
      this.isRegularUpdateOn = true;
    }
}
