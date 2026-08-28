class MealPlan {
  #elements = {
    overlay: document.getElementById('modal-overlay'),
    mealPlanContainer: document.getElementById('meal-plan-modal'),
    mealPlanGrid: document.getElementById('meal-plan-grid'),
    closeBtnContainer: document.getElementById('close-meal-plan-btn'),
    showBtn: document.getElementById('meal-plan-nav-btn'),
    modelSelect: document.getElementById('select-day-modal'),
    closeBtnSelectModel: document.getElementById('close-select-day-btn'),
    recipeContainer: document.getElementById('recipe-container'),
    daysListContainer: document.getElementById('days-list-container'),
    mealPlanCount: document.getElementById('meal-plan-count'),
  };
  constructor() {
    this.handlerCloseModel();
    this.handlerCloseModelSelect();
  }
  showModel() {
    this.#elements.mealPlanContainer.classList.add('is-open');
    this.#elements.overlay.classList.add('is-open');
    this.#elements.overlay.classList.add('overlay-shape-2');
    this.#elements.mealPlanContainer.setAttribute('aria-modal', true);
  }
  hiddenModel() {
    this.#elements.mealPlanContainer.classList.remove('is-open');
    this.#elements.overlay.classList.remove('is-open');
    this.#elements.overlay.classList.remove('overlay-shape-2');
    this.#elements.mealPlanContainer.setAttribute('aria-modal', false);
  }
  showModelSelect() {
    const modelSelect = document.getElementById('select-day-modal');
    modelSelect.classList.add('is-open');
    modelSelect.setAttribute('aria-modal', true);
    this.#elements.overlay.classList.add('is-open');
    this.#elements.overlay.classList.add('overlay-shape-2');
  }
  hiddenModelSelect() {
    this.#elements.modelSelect.classList.remove('is-open');
    this.#elements.modelSelect.setAttribute('aria-modal', false);
    this.#elements.overlay.classList.remove('is-open');
    this.#elements.overlay.classList.remove('overlay-shape-2');
  }
  #gemerateMarkup(data) {
    return `
            <div
            class="bg-white rounded-2xl p-4 border border-cream-200 shadow-sm flex flex-col justify-between gap-4 w-full"
            data-id="${data.id}"
            data-dayOfWeek="${data.dayOfWeak}"
            id="item-recipe-meal-plan"
            >
            <div
                class="flex items-center flex-wrap gap-2 justify-between border-b border-cream-100 pb-2"
            >
                <h3 class="font-bold text-primary-600 text-lg">${data.dayOfWeak}</h3>
                <span
                class="text-sm font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-500"
                >Day ${data.day}</span
                >
            </div>
            <div class="flex items-center gap-4">
                <a
                href="#${data.id}"
                id="recipe-item"
                class="bg-white w-full rounded-2xl p-4 border border-cream-200 shadow-sm flex flex-col gap-8 transition-all duration-300 hover:border-primary-300 hover:shadow-md group"
                >
                <img
                    src="${data.image}"
                    alt="${data.title}"
                    class="w-full h-40 object-cover rounded-xl border border-cream-200 shrink-0"
                />
                <div class="flex flex-col gap-2 min-w-0">
                    <h4 class="font-bold text-charcoal-800 text-xl truncate">
                    ${data.title}
                    </h4>
                    <span class="text-sm font-medium text-charcoal-500 truncate"
                    >${data.publisher}</span
                    >
                </div>
                </a>                
            </div>
            <button
                class="delete-btn flex items-center justify-center gap-2 rounded-xl bg-white text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all text-base font-semibold shadow-sm cursor-pointer p-3 w-full"
                title="Delete item"
                id="delete-item-meal-plan"
            >
                <svg class="size-5 fill-current">
                    <use href="./icons.svg#icon-minus-circle"></use>
                </svg>
                <span>Delete</span>
            </button>
            </div>
    `;
  }
  renderReecipeInMealPlan(data) {
    const noMealMessage = document.getElementById('no-meal-message');
    if (noMealMessage) noMealMessage.remove();
    this.#elements.mealPlanGrid.insertAdjacentHTML(
      'beforeend',
      this.#gemerateMarkup(data),
    );
  }
  setabledAbilityBtnsSelect(data) {
    data.forEach(el => {
      this.#elements.daysListContainer
        .querySelectorAll('.btn-day-select-day')
        .forEach(btn => {
          if (btn.dataset.day === el.dayOfWeak) btn.disabled = true;
        });
    });
  }
  setAbeldBtnsSelect(dayOfWeek) {
    this.#elements.daysListContainer.querySelector(
      `[data-day='${dayOfWeek}']`,
    ).disabled = false;
  }
  removeItem(el) {
    el.remove();
  }
  renderRecipeInMealPlanFromLocalStortge(data) {
    if (!data.length) return;
    const noMealMessage = document.getElementById('no-meal-message');
    if (noMealMessage) noMealMessage.remove();
    const markup = data.map(el => this.#gemerateMarkup(el)).join('');
    this.#elements.mealPlanGrid.innerHTML = markup;
    this.setabledAbilityBtnsSelect(data);
  }
  removeAnySelctedRecipe() {
    const resultsList = document.getElementById('results-list');
    if (resultsList?.querySelector('.bg-cream-200'))
      resultsList
        .querySelector('.bg-cream-200')
        .classList.remove('bg-cream-200');
  }
  renderToInitView() {
    const markup = `
        <div
            class="flex flex-col items-center justify-center text-center py-6 text-charcoal-400 gap-2"
            id="no-meal-message"
          >
            <svg class="w-8 h-8 text-cream-300" aria-hidden="true">
              <use href="./icons.svg#icon-smile-2"></use>
            </svg>
            <p class="text-lg">No meal assigned</p>
        </div>
    `;
    this.#elements.mealPlanGrid.innerHTML = markup;
  }
  updateCountRecipes(count) {
    this.#elements.mealPlanCount.textContent = count;
  }
  disabledBtn(btnEl) {
    btnEl.disabled = true;
  }
  addHandlerShowBtnModel(handler) {
    this.#elements.showBtn.addEventListener('click', handler);
  }
  addHandlerHiddenBtnModel(handler) {
    this.#elements.closeBtnContainer.addEventListener('click', handler);
  }
  addHandlerBtnAdd(handler) {
    this.#elements.recipeContainer.addEventListener('click', e => {
      const targetEl = e.target;
      if (!targetEl.closest('#recipe-meal-plan-btn')) return;
      handler();
    });
  }
  addHandlerSelectBtn(handler) {
    this.#elements.daysListContainer.addEventListener('click', e => {
      const targetEl = e.target;
      if (!targetEl.closest('#day-item')) return;
      const item = targetEl.closest('#day-item');
      const day = item.dataset.index;
      const btn = item.querySelector('.btn-day-select-day');
      const dayOfWeak = item.querySelector('.btn-day-select-day').dataset.day;
      const data = { day, dayOfWeak, btn };
      handler(data);
    });
  }
  addHandlerHiddenBtnModelSelect(handler) {
    this.#elements.closeBtnSelectModel.addEventListener('click', handler);
  }
  addHandlerClickOfRecipeInList(handler) {
    this.#elements.mealPlanGrid.addEventListener('click', e => {
      const targetEl = e.target;
      if (!targetEl.closest('#recipe-item')) return;
      handler();
    });
  }
  addHandlerDeleteBtn(handler) {
    this.#elements.mealPlanGrid.addEventListener('click', e => {
      const targetEl = e.target;
      if (!targetEl.closest('#delete-item-meal-plan')) return;
      const parentEl = targetEl.closest('#item-recipe-meal-plan');
      handler(parentEl);
    });
  }
  handlerCloseModel() {
    this.#elements.overlay.addEventListener('click', () => {
      if (!this.#elements.mealPlanContainer.classList.contains('is-open'))
        return;
      this.hiddenModel();
    });
    document.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        this.#elements.mealPlanContainer.classList.contains('is-open')
      ) {
        this.hiddenModel();
      }
    });
  }
  handlerCloseModelSelect() {
    this.#elements.overlay.addEventListener('click', () => {
      if (!this.#elements.modelSelect.classList.contains('is-open')) return;
      this.hiddenModelSelect();
    });
    document.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        this.#elements.modelSelect.classList.contains('is-open')
      ) {
        this.hiddenModelSelect();
      }
    });
  }
}
export default new MealPlan();
