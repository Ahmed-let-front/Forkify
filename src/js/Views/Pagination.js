class Pagination {
  parentEl;
  #elements = {
    prevPageBtn: document.getElementById('prev-page-btn'),
    nextPageBtn: document.getElementById('next-page-btn'),
  };
  setParentEl() {
    this.parentEl = document.getElementById('results-list');
  }
  /**
   * @param {() => void} handler
   */
  addHandlerPangationNext(handler) {
    this.setParentEl();
    this.#elements.nextPageBtn.addEventListener('click', handler);
  }
  /**
   * @param {() => void} handler
   */
  addHandlerPangationPrev(handler) {
    this.setParentEl();
    this.#elements.prevPageBtn.addEventListener('click', handler);
  }
}
export default new Pagination();