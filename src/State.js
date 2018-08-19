export default class {
    input = '';

    isInputValid = true;

    urls = [];

    titles = [];

    articles = [];

    isRegularUpdateOn = false;

    updateInput(newInput) {
      this.input = newInput;
    }

    updateIsInputValid(newState) {
      this.isInputValid = newState;
    }

    addNewUrl(newUrls) {
      this.urls = [newUrls, ...this.urls];
    }

    addNewTitles(newTitles) {
      this.titles = [...newTitles, ...this.titles];
    }

    addNewArticles(newArticles) {
      this.articles = [...newArticles, ...this.articles];
    }

    switchOnRegularUpdate() {
      this.isRegularUpdateOn = true;
    }
}
