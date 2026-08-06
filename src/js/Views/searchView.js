class SearchView {
  #parentEl;
  #elements = {
    formSearch: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    searchResContianer: document.getElementById('search-res-container'),
    prevPageNum: document.querySelector('.prev-page-num'),
    nextPageNum: document.querySelector('.next-page-num'),
    containerBtnsPagination: document.getElementById('pagination-container'),
    bookmarksPanel: document.getElementById('bookmarks-panel'),
  };
  get parentEl() {
    return this.#parentEl;
  }
  #generateMarkupSearchRes(data) {
    return `
          <li class="preview">
            <a href="#${data.id}" class="list-result flex flex-col md:flex-row items-center gap-8 p-4 sm:p-5 rounded-3xl bg-cream-50/60 hover:bg-cream-100/80 border border-cream-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
              <div class="preview__fig relative w-full sm:w-28 h-48 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-cream-200" role="img" aria-label="${data.title} photo">
                <img 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src="${data.image_url}" 
                  alt="${data.title}"
                  aria-hidden="true"
                />
              </div>
              <div class="gap-4 flex flex-col justify-center w-full text-center sm:text-left transition-transform duration-500 group-hover:translate-x-4" role="group" aria-label="Recipe details">
                <h2 class="title text-xl md:text-2xl font-extrabold text-charcoal-800 tracking-tight group-hover:text-primary-600 transition-colors">
                  ${data.title}
                </h2>
                <p class="author text-base md:text-lg font-semibold uppercase tracking-wider text-charcoal-400">
                  ${data.publisher}
                </p>
              </div>
              <div class="btn--round bg-primary-50 [background-image:none] ${data.key ? '' : 'hidden'}">
                <svg><use href="./icons.svg#icon-user"></use></svg>
              </div>
            </a>
          </li> `;
  }
  #getQuery() {
    return this.#elements.searchInput.value.trim();
  }
  injectionMarkupListContainer() {
    if (document.getElementById('results-list')) return;
    const markup = `
     <ul class="flex flex-col gap-4" id="results-list"></ul>
    `;
    const welcomeViewContainer = document.getElementById('welcome-view');
    if (welcomeViewContainer) welcomeViewContainer.remove();
    this.#elements.searchResContianer.insertAdjacentHTML('afterbegin', markup);
    this.#parentEl = document.getElementById('results-list');
  }
  /**
   * @param {import('../model.js').RecipeSummary[]} data
   */
  renderResContainerList(data) {
    this.#elements.searchInput.value = '';
    let markup = ``;
    data.forEach(data => {
      markup += this.#generateMarkupSearchRes(data);
    });
    this.#parentEl.innerHTML = markup;
  }
  renderPageCount(maxItems) {
    this.#elements.containerBtnsPagination.querySelector(
      '.page-count',
    ).textContent = maxItems;
  }
  returnToWelcomeView() {
    const markup = `
        <div
          class="flex flex-col items-center justify-center text-center p-8 sm:p-12 md:p-16 bg-white rounded-3xl shadow-2xl shadow-black/30 max-w-3xl text-xl gap-6"
          id="welcome-view"
        >
          <svg
            class="h-28 w-28 sm:h-36 sm:w-36 fill-orange-300 transition-transform duration-300 hover:scale-110 drop-shadow-sm"
          >
            <use href="./icons.svg#icon-cutlery"></use>
          </svg>
          <h2
            class="text-3xl sm:text-5xl font-extrabold text-stone-800 mb-4 sm:mb-6 tracking-tight leading-tight"
          >
            Let's Get Cooking!
          </h2>

          <p
            class="leading-relaxed text-stone-600 sm:mb-10 max-w-xl font-normal"
          >
            Search for over 1,000,000 delicious recipes by ingredient or name.
            Need inspiration? Try something popular below!
          </p>

          <div
            class="flex flex-wrap items-center justify-center gap-5 sm:gap-4"
          >
            <h3
              class="w-full font-bold text-stone-400 uppercase tracking-widest mb-2"
            >
              Popular searches:
            </h3>
            <div
              class="btns-welcome-view flex items-center gap-6 flex-wrap justify-center"
            >
              <button data-query="pizzaaaa" class="btn-welcome-view">Pizza</button>
              <button data-query="pasta" class="btn-welcome-view">Pasta</button>
              <button data-query="burger" class="btn-welcome-view">
                Burgers
              </button>
              <button data-query="avocado" class="btn-welcome-view">
                Avocado
              </button>
            </div>
        `;
    this.#elements.searchResContianer
      .querySelectorAll('& > *:not(footer)')
      .forEach(el => el.remove());
    this.#elements.searchResContianer.insertAdjacentHTML('afterbegin', markup);
  }
  unFoucsOnSerchInput() {
    document.activeElement.blur();
  }
  /**
   * @param {Event} e
   * @returns {string}
   */
  getQueryFromClickBtn(e) {
    return e.target.dataset.query;
  }
  /**
   * Renders the page numbers shown in the prev/next buttons, wrapping around
   * at the first and last page while the actual page state resets in model.
   * @param {number} currPage
   * @param {number} maxItems
   */
  renderPageNum(currPage, maxItems) {
    this.#elements.nextPageNum.textContent =
      currPage === maxItems ? 1 : currPage + 1;
    this.#elements.prevPageNum.textContent =
      currPage === 1 ? maxItems : currPage - 1;
  }
  removeAnyListSelcted(parentEl) {
    if (!parentEl) return;
    parentEl.querySelector('.bg-cream-200')?.classList.remove('bg-cream-200');
  }
  addHandlerListsResults() {
    this.#parentEl.addEventListener('click', e => {
      const listRes = e.target.closest('.list-result');
      if (listRes?.classList.contains('bg-cream-200')) return;
      this.removeAnyListSelcted(this.#elements.bookmarksPanel);
      this.removeAnyListSelcted(e.currentTarget);
      if (listRes) listRes.classList.add('bg-cream-200');
    });
  }
  /**
   * @param {(e: Event) => Promise<void>} handler
   */
  addHandlerBtnsWelcomeView(handler) {
    const btnsContainerWelcomeView =
      document.querySelector('.btns-welcome-view');
    btnsContainerWelcomeView.addEventListener('click', e => {
      if (e.target.classList.contains('btn-welcome-view')) handler(e);
    });
  }
  /**
   * @param {(query: string) => Promise<void>} handler
   */
  addHandlerRenderSearchRes(handler) {
    this.#elements.formSearch.addEventListener('submit', e => {
      e.preventDefault();
      handler(this.#getQuery());
    });
  }
}
export default new SearchView();
