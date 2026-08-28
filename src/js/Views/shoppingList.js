import { converDecimalToFraction } from '../model';
class ShoppingList {
  #elements = {
    ShoppingContainer: document.getElementById('shopping-list-container'),
    closeBtn: document.getElementById('close-btn-shopping-list'),
    ShoppingBtn: document.getElementById('shopping-list-btn'),
    shoppingItemsContainer: document.getElementById('items-container-shopping'),
    countRecipesShopping: document.getElementById(
      'count-recipes-shopping-list',
    ),
    overlay: document.getElementById('modal-overlay'),
  };
  constructor() {
    this.handlerCloseModel();
  }
  showShoppingContanier() {
    this.#elements.ShoppingContainer.classList.add('is-open');
    this.#elements.overlay.classList.add('is-open');
    this.#elements.overlay.classList.add('overlay-shape-2');
    this.#elements.ShoppingContainer.setAttribute('aria-modal', true);
  }
  hiddenShoppingContanier() {
    this.#elements.ShoppingContainer.classList.remove('is-open');
    this.#elements.overlay.classList.remove('is-open');
    this.#elements.overlay.classList.remove('overlay-shape-2');
    this.#elements.ShoppingContainer.setAttribute('aria-modal', false);
  }
  handlerCloseModel() {
    this.#elements.overlay.addEventListener('click', () => {
      if (!this.#elements.ShoppingContainer.classList.contains('is-open'))
        return;
      this.hiddenShoppingContanier();
    });
    document.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        this.#elements.ShoppingContainer.classList.contains('is-open')
      ) {
        this.hiddenShoppingContanier();
      }
    });
  }
  #generateMarkup(data) {
    const lastEl = data.at(-1);
    const markup = `
    <div class="mb-6 p-4 sm:p-6 rounded-2xl bg-cream-50/50 border border-cream-200" data-id="${lastEl.id}" id="item-list">
      <div
        class="flex flex-wrap  sm:items-center justify-between gap-7 mb-4 pb-3 border-b border-cream-200"
      >
        <h3
          class="text-xl md:text-2xl font-bold text-charcoal-800 flex items-center gap-3"
        >
          <span class="w-3.5 h-3.5 rounded-full bg-primary-500 shrink-0"></span>
          ${lastEl.title}
        </h3>
        <img 
            src="${lastEl.image}" 
            alt="${lastEl.title}" 
            class="w-full h-40 object-cover rounded-xl border border-cream-200 shadow-sm"
          />
        <span
          class="self-start sm:self-auto text-lg w-full text-center font-bold mb-3 text-charcoal-500 bg-white px-3 py-1 rounded-xl border border-cream-200"
          >${lastEl.ingredients.length} Ingredients</span
        >
        <button
            class="delete-btn flex items-center gap-2 rounded-xl bg-white text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all text-xl font-semibold shadow-sm cursor-pointer p-3 w-full justify-center"
            title="Delete item"
            id="delete-item-shopping-list"
          >
            <svg class="size-6 fill-current">
              <use href="./icons.svg#icon-minus-circle"></use>
            </svg>
            <span>Delete</span>
          </button>
      </div>
       <ul class="space-y-3.5">
        ${lastEl.ingredients
          .map(
            ing => `
        <li
            class="flex items-center p-4 rounded-xl bg-white border border-cream-200/60 hover:border-primary-300 transition-all"
          >
            <div class="flex items-center gap-4">
              <span class="text-lg md:text-xl font-medium text-charcoal-700 leading-snug">
                ${ing.quantity ? `${converDecimalToFraction(ing.quantity)} ` : ''}
                <span class="text-sm text-charcoal-500">${ing.unit || ''}</span>
                ${ing.description}
              </span>
            </div>
        </li>`,
          )
          .join('')}
      </ul>
     </div>
    `;
    return markup;
  }
  #generateMarkupFromLocalStortge(data) {
    const markup = `
        ${data
          .map(
            recipe => `
    <div class="mb-6 p-4 sm:p-6 rounded-2xl bg-cream-50/50 border border-cream-200" data-id="${recipe.id}" id="item-list">
      <div
        class="flex flex-wrap sm:items-center justify-between gap-7 mb-4 pb-3 border-b border-cream-200"
      >
        <h3
          class="text-xl md:text-2xl font-bold text-charcoal-800 flex items-center gap-3"
        >
          <span class="w-3.5 h-3.5 rounded-full bg-primary-500 shrink-0"></span>
          ${recipe.title}
        </h3>
        <img 
            src="${recipe.image}" 
            alt="${recipe.title}" 
            class="w-full h-40 object-cover rounded-xl border border-cream-200 shadow-sm"
        />
        <span
          class="self-start sm:self-auto text-lg w-full text-center mb-3 font-bold text-charcoal-500 bg-white px-3 py-1 rounded-xl border border-cream-200"
          >${recipe.ingredients.length} Ingredients</span
        >
        <button
            class="delete-btn flex items-center gap-2 rounded-xl bg-white text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all text-xl font-semibold shadow-sm cursor-pointer p-3 w-full justify-center"
            title="Delete item"
            id="delete-item-shopping-list"
          >
            <svg class="size-6 fill-current">
              <use href="./icons.svg#icon-minus-circle"></use>
            </svg>
            <span>Delete</span>
          </button>
      </div>

      <ul class="space-y-3.5">
        ${recipe.ingredients
          .map(
            ing => `
          <li
            class="flex items-center p-4 rounded-xl bg-white border border-cream-200/60 hover:border-primary-300 transition-all"
          >
            <div class="flex items-center gap-4">
              <span class="text-lg md:text-xl font-medium text-charcoal-700 leading-snug">
                ${ing.quantity ? `${converDecimalToFraction(ing.quantity)} ` : ''}
                <span class="text-sm text-charcoal-500">${ing.unit || ''}</span>
                ${ing.description}
              </span>
            </div>
          </li>
        `,
          )
          .join('')}
      </ul>
    </div>
  `,
          )
          .join('')}
    `;
    return markup;
  }
  renderItemInShoppingList(data) {
    const noShoppingMessageEl = document.getElementById('no-shopping-message');
    if (noShoppingMessageEl) noShoppingMessageEl.remove();
    this.#elements.shoppingItemsContainer.insertAdjacentHTML(
      'beforeend',
      this.#generateMarkup(data),
    );
  }
  renderItemInShoppingListLocalStortge(data) {
    this.#elements.shoppingItemsContainer.innerHTML =
      this.#generateMarkupFromLocalStortge(data);
  }
  removeItem(id) {
    const targetEl = document.querySelector(`[data-id="${id}"]`);
    targetEl.remove();
  }
  renderToInitView() {
    const markup = `
        <div id="no-shopping-message">
          <div>
            <svg
              class="w-12 h-12 text-primary-400 mx-auto mb-6"
              aria-hidden="true"
            >
              <use href="/icons.svg#icon-smile-2" />
            </svg>
          </div>
          <p class="text-charcoal-500 m-0 text-2xl">
            No shopping list items yet. Add ingredients from your favorite
            recipes :)
          </p>
        </div>
    `;
    this.#elements.shoppingItemsContainer.innerHTML = markup;
  }
  updateCount(data) {
    this.#elements.countRecipesShopping.textContent = data.length;
  }
  addHandlerShoppingBtnShow(handler) {
    this.#elements.ShoppingBtn.addEventListener('click', handler);
  }
  addHandlerShoppingBtnClose(handler) {
    this.#elements.closeBtn.addEventListener('click', handler);
  }
  addHandlerAddIngredient(handler) {
    const shoppingBtnAdd = document.getElementById('btn-add-to-shopping-list');
    shoppingBtnAdd.addEventListener('click', handler);
  }
  addHandlerRemoveIngredient(handler) {
    this.#elements.ShoppingContainer.addEventListener('click', e => {
      const targetEl = e.target;
      if (!targetEl.closest('#delete-item-shopping-list')) return;
      const id = targetEl.closest('#item-list').dataset.id;
      handler(id);
    });
  }
}
export default new ShoppingList();
