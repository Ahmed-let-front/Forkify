import { converDecimalToFraction } from '../model.js';
class Recipe {
  #parentEl = document.getElementById('recipe-container');
  #data;
  get parentEl() {
    return this.#parentEl;
  }
  /**
   * @param {import('../model.js').Recipe} data
   */
  render(data) {
    this.#data = data;
    this.#parentEl.innerHTML = this.#generateMarkupRecipe();
  }
  #generateMarkupRecipe() {
    return `                
            <figure class="relative h-120 overflow-hidden after:inset-0 after:absolute after:backdrop-brightness-55">
                <img
                    src="${this.#data.image}"
                    alt="${this.#data.title} photo"
                    class="w-full h-full object-cover block transition-transform duration-700 hover:scale-105"
                />
                <figcaption>
                    <h2
                    class="absolute bottom-6 left-1/2 -translate-x-1/2 md:whitespace-nowrap text-center text-white font-extrabold text-xl md:text-3xl tracking-tight leading-tight uppercase drop-shadow-md bg-gradient-warm px-6 py-2 rounded-2xl z-10"
                    >
                    ${this.#data.title}
                    </h2>
                </figcaption>
                </figure>
                <div
                class="flex items-center flex-wrap gap-6 justify-around p-8 md:p-10 bg-cream-50/60 backdrop-blur-sm border-b border-cream-200 text-xl md:text-2xl"
                >
                <div class="flex items-center gap-3 text-charcoal-600 font-bold">
                    <svg class="w-6 h-6 text-primary-500">
                    <use href="./icons.svg#icon-clock"></use>
                    </svg>
                    <span>${this.#data.cookingTime}</span>
                    <span class="font-normal text-charcoal-400">minutes</span>
                </div>

                <div class="flex items-center gap-3 text-charcoal-600 font-bold">
                    <svg class="w-6 h-6 text-primary-500">
                    <use href="./icons.svg#icon-users"></use>
                    </svg>
                    <output class="ser-count">${this.#data.servings}</output>
                    <span class="font-normal text-charcoal-400">servings</span>

                    <div class="flex items-center gap-1 ml-2" id="container-update-btn-ing">
                    <button
                        class="btn--tiny update-ing-btn dcreaseServingsBtn"
                        data-update-to="${this.#data.servings - 1}"
                    >
                        <svg><use href="./icons.svg#icon-minus-circle"></use></svg>
                    </button>
                    <button
                        class="btn--tiny update-ing-btn increaseServingsBtn"
                        data-update-to="${this.#data.servings + 1}"
                    >
                        <svg><use href="./icons.svg#icon-plus-circle"></use></svg>
                    </button>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <div class="btn--round bg-primary-50 [background-image:none] ${this.#data.key ? '' : 'hidden'}">
                    <svg><use href="./icons.svg#icon-user"></use></svg>
                    </div>
                    <button class="btn--round btn--bookmark">
                    <svg><use href="./icons.svg#icon-bookmark-2"></use></svg>
                    </button>
                </div>
                </div>

                <div class="p-8 md:p-12 bg-cream-100/50 flex flex-col items-center gap-8">
                <h3
                    class="text-2xl md:text-3xl font-extrabold uppercase tracking-wider text-charcoal-800 bg-gradient-text bg-clip-text text-transparent mb-4"
                >
                    Recipe ingredients
                </h3>

                <ul class="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl" id="list-container-ing">
                    ${this.#generateMarkupING()}
                </ul>
                </div>

                <div class="p-8 md:p-12 flex flex-col items-center text-center gap-6">
                <h3
                    class="text-2xl md:text-3xl font-extrabold uppercase tracking-wider text-charcoal-800 bg-gradient-text bg-clip-text text-transparent"
                >
                    How to cook it
                </h3>
                <p
                    class="max-w-2xl text-charcoal-500 text-base md:text-lg leading-relaxed"
                >
                    This recipe was carefully designed and tested by
                    <span class="font-bold text-charcoal-700">${this.#data.publisher}</span
                    >. Please check out directions at their website.
                </p>
                <a
                    class="btn btn--small mt-2 text-base md:text-lg"
                    href="${this.#data.sourceUrl}"
                    target="_blank"
                >
                    <span>Directions</span>
                    <svg><use href="./icons.svg#icon-arrow-right"></use></svg>
                </a>
                </div>`;
  }
  #generateMarkupING() {
    return this.#data.ingredients
      .map(ing => {
        return `
                    <li class="recipe__ingredient text-xl text-charcoal-600">
                            <svg class="w-5 h-5 text-primary-500 shrink-0"><use href="./icons.svg#icon-check"></use></svg>
                            <p>
                            <strong class="font-bold text-charcoal-800">${ing.quantity ? converDecimalToFraction(ing.quantity) : ''} ${ing.unit}</strong>
                            <span>${ing.description}</span>
                            </p>
                        </li>
                    `;
      })
      .join('');
  }
  renderInitContent() {
    const markup = `
        <div
          class="flex flex-col items-center justify-center text-center gap-5 px-8 py-20 md:py-32"
        >
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-warm shadow-[0_12px_30px_-8px_rgba(249,115,22,0.5)] animate-float"
          >
            <svg class="w-10 h-10 text-white" aria-hidden="true">
              <use href="./icons.svg#icon-smile-2" />
            </svg>
          </div>
          <p
            class="max-w-md text-charcoal-500 m-0 text-[clamp(1.4rem,1.3vw,1.7rem)]"
          >
            Start by searching for a recipe or an ingredient. Have fun!
          </p>
        </div>`;
    this.#parentEl.innerHTML = markup;
  }
  /**
   * @param {() => Promise<void>} handler
   */
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }
  /**
   * @param {(updateTo: number) => void} handler
   */
  addHandlerUpdateIngBtn(handler) {
    const containerUpdateIngBtns = this.#parentEl.querySelector(
      '#container-update-btn-ing',
    );
    containerUpdateIngBtns.addEventListener('click', e => {
      const targetBtn = e.target.closest('.update-ing-btn');
      if (!targetBtn) return;
      const updateTo = +targetBtn.dataset.updateTo;
      handler(updateTo);
    });
  }
  /**
   * Re-renders only the ingredient list and updates the serving buttons so
   * scaling keeps working from the new base without re-rendering the whole
   * recipe card.
   * @param {import('../model.js').Ingredient[]} dataIng
   * @param {number} updateTo
   */
  renderNewIng(dataIng, updateTo) {
    const newIngMarkup = this.#generateMarkupING(dataIng);
    const increaseServingsBtn = this.#parentEl.querySelector(
      '.increaseServingsBtn',
    );
    const dcreaseServingsBtn = this.#parentEl.querySelector(
      '.dcreaseServingsBtn',
    );
    this.#parentEl.querySelector('#list-container-ing').innerHTML =
      newIngMarkup;
    this.#parentEl.querySelector('.ser-count').textContent = updateTo;
    increaseServingsBtn.dataset.updateTo = updateTo + 1;
    dcreaseServingsBtn.dataset.updateTo = updateTo - 1;
  }
}
export default new Recipe();
