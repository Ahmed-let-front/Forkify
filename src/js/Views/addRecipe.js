class AddRecipe {
  parentEl = document.getElementById('recipe-modal');
  #elements = {
    btnAddRecipe: document.getElementById('open-modal-btn'),
    overlay: document.getElementById('modal-overlay'),
    modelRecipe: document.getElementById('recipe-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    uploadForm: document.getElementById('upload-form'),
    addIngredientBtn: document.getElementById('add-ingredient-btn'),
    ingredientInputs: document.getElementById('ingredientInputs'),
    inputCount: 7,
    model: document,
  };
  ListenerOpenModel() {
    this.#elements.btnAddRecipe.addEventListener(
      'click',
      this.openModel.bind(this),
    );
  }
  openModel() {
    this.#elements.overlay.classList.add('overlay-shape-2');
    this.#elements.overlay.classList.add('is-open');
    this.#elements.modelRecipe.setAttribute('aria-modal', 'true');
    this.#elements.modelRecipe.classList.add('is-open');
  }
  closeModel() {
    this.#elements.overlay.classList.remove('overlay-shape-2');
    this.#elements.overlay.classList.remove('is-open');
    this.#elements.modelRecipe.setAttribute('aria-modal', 'false');
    this.#elements.modelRecipe.classList.remove('is-open');
  }
  closeModelHandler() {
    this.#elements.closeModalBtn.addEventListener(
      'click',
      this.closeModel.bind(this),
    );
    this.#elements.overlay.addEventListener('click', () => {
      if (!this.#elements.modelRecipe.classList.contains('is-open')) return;
      this.closeModel();
    });
    document.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        this.#elements.modelRecipe.classList.contains('is-open')
      ) {
        this.closeModel();
      }
    });
  }
  #genrateMarkupBtnIngredient() {
    const markup = `
              <div class="flex flex-col">
                <label
                  for="ingredient-${this.#elements.inputCount}"
                  class="block text-base md:text-lg font-semibold text-charcoal-700 mb-1"
                  >Ingredient ${this.#elements.inputCount}</label
                >
                <input
                  id="ingredient-${this.#elements.inputCount}"
                  type="text"
                  name="ingredient-${this.#elements.inputCount}"
                  placeholder="Format: Quantity,Unit,Description"
                  class="w-full rounded-xl border border-cream-300 bg-white px-4 py-3 md:py-3.5 text-charcoal-800 placeholder-charcoal-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-lg md:text-xl"
                />
              </div>
    `;
    this.#elements.inputCount++;
    return markup;
  }
  appendMarkupInputBtn() {
    this.#elements.ingredientInputs.insertAdjacentHTML(
      'beforeend',
      this.#genrateMarkupBtnIngredient(),
    );
  }
  /**
   * @param {(data: Object) => Promise<void>} handler
   */
  addHandlerUpload(handler) {
    this.#elements.uploadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  addHandlerAddInputIngredient(handler) {
    this.#elements.addIngredientBtn.addEventListener('click', handler);
  }
}
export default new AddRecipe();
