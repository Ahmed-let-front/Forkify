class BookMark {
  #parentEl = document.getElementById('recipe-container');
  #elements = {
    bookmarkBtn: document.getElementById('toggle-bookmarks-btn'),
    bookMarkList: document.querySelector('.bookmarks'),
    overlay: document.getElementById('modal-overlay'),
  };
  /**
   * @param {() => void} handler
   */
  addHandlerBookMark(handler) {
    this.#parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }
  /**
   * @param {import('../model.js').Recipe} recipe
   */
  toogleRenderBookmark(recipe) {
    if (!recipe.bookMarked) {
      const btn = this.#parentEl.querySelector('.btn--bookmark');
      const useEl = btn.querySelector('use');
      useEl.setAttribute('href', './icons.svg#icon-bookmark-2');
      return;
    }
    const btn = this.#parentEl.querySelector('.btn--bookmark');
    const useEl = btn.querySelector('use');
    useEl.setAttribute('href', './icons.svg#icon-bookmark-fill');
  }
  updateUiBookMarkCount(bookMarkCount) {
    const bookMarkCountEl = document.getElementById('bookmark-count');
    bookMarkCountEl.textContent = bookMarkCount;
  }
  #generateMarkupRecupesList(recipe) {
    return `
        <li class="preview-list" data-id="${recipe.id}">
            <a href="#${recipe.id}" class="list-result flex items-center gap-5 p-4 rounded-2xl bg-cream-50/60 hover:bg-cream-100/80 border border-cream-200/60 transition-all duration-300 hover:shadow-lg  group">
                <div class="preview__fig relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-cream-200 shadow-sm" role="img" aria-label="${recipe.title} photo">
                <img 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src="${recipe.image}" 
                    alt="${recipe.title}"
                />
                </div>
                <div class="flex flex-col justify-center min-w-0 flex-1 text-left gap-1.5" role="group" aria-label="Recipe details">
                <h2 class="title text-lg font-extrabold text-charcoal-800 tracking-tight truncate group-hover:text-primary-600 transition-colors">
                    ${recipe.title}
                </h2>
                <p class="author text-sm font-bold uppercase tracking-wider text-charcoal-400 truncate">
                    ${recipe.publisher}
                </p>
                </div>
                <div class="btn--round bg-primary-50 [background-image:none] ${recipe.key ? '' : 'hidden'}">
                <svg><use href="./icons.svg#icon-user"></use></svg>
              </div>
            </a>
         </li>
    `;
  }
  /**
   * @param {import('../model.js').Recipe[]} bookMarkArr
   */
  renderRecipes(bookMarkArr) {
    if (bookMarkArr.length === 1) this.#elements.bookMarkList.innerHTML = '';
    const recipe = bookMarkArr.at(-1);
    const markup = this.#generateMarkupRecupesList(recipe);
    this.#elements.bookMarkList.insertAdjacentHTML('beforeend', markup);
  }
  /**
   * @param {import('../model.js').Recipe[]} bookMarkArr
   */
  renderRecipesFromLocalStortge(bookMarkArr) {
    const markup = bookMarkArr
      .map(rec => this.#generateMarkupRecupesList(rec))
      .join('');
    this.#elements.bookMarkList.innerHTML = markup;
  }
  renderToInitShape() {
    const markup = `
              <li class="p-6 text-center flex flex-col items-center gap-3">
                <div>
                  <svg class="w-12 h-12 text-primary-400" aria-hidden="true">
                    <use href="./icons.svg#icon-smile-2" />
                  </svg>
                </div>
                <p
                  class="text-charcoal-500 m-0 text-[clamp(1.2rem,1.1vw,1.4rem)]"
                >
                  No bookmarks yet. Find a nice recipe and bookmark it :)
                </p>
              </li>
    `;
    this.#elements.bookMarkList.innerHTML = markup;
  }
  removeAnyListSelcted(parentEl) {
    if (!parentEl) return;
    parentEl.querySelector('.bg-cream-200')?.classList.remove('bg-cream-200');
  }
  /**
   * @param {import('../model.js').Recipe} recipe
   */
  removeBookmark(recipe) {
    const id = recipe.id;
    const item = this.#elements.bookMarkList.querySelector(`[data-id="${id}"]`);
    if (!item) return;
    item.remove();
    if (this.#elements.bookMarkList.children.length === 0) {
      this.renderToInitShape();
    }
  }
  addHandlerListsBookMarks() {
    const bookmarksPanel = document.getElementById('bookmarks-panel');
    bookmarksPanel.addEventListener('click', e => {
      const listRes = e.target.closest('.preview-list');
      if (listRes?.classList.contains('bg-cream-200')) return;
      const containerSearchRes = document.getElementById('results-list');
      this.removeAnyListSelcted(containerSearchRes);
      this.removeAnyListSelcted(e.currentTarget);
      listRes.classList.add('bg-cream-200');
    });
  }
  /**
   * Highlights the bookmark entry matching the currently loaded recipe hash
   * after a page reload restores the list.
   * @param {string} id
   */
  autoSelctedAfterReload(id) {
    const allPreviewList =
      this.#elements.bookMarkList.querySelectorAll('.preview-list');
    allPreviewList.forEach(el => {
      const idEl = el.dataset.id;
      if (!idEl) return;
      if (idEl === id) el.classList.add('bg-cream-200');
    });
  }
  toogleBookMarkListShape() {
    this.#elements.bookMarkList.classList.toggle('is-open');
    this.#elements.overlay.classList.toggle('is-open');
  }
  /**
   * @param {() => void} handler
   */
  addHandlerBookMarkBtn(handler) {
    this.#elements.bookmarkBtn.addEventListener('click', handler);
  }
  handlerCloseList() {
    this.#elements.overlay.addEventListener('click', e => {
      if (!this.#elements.bookMarkList.classList.contains('is-open')) return;
      this.#elements.bookMarkList.classList.remove('is-open');
      e.currentTarget.classList.remove('is-open');
    });
    document.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        this.#elements.bookMarkList.classList.contains('is-open')
      ) {
        this.#elements.bookMarkList.classList.remove('is-open');
        this.#elements.overlay.classList.remove('is-open');
      }
    });
  }
}
export default new BookMark();
