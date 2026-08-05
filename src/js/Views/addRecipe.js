class AddRecipe {
  parentEl = document.getElementById('recipe-modal');
  #elements = {
    btnAddRecipe: document.getElementById('open-modal-btn'),
    overlay: document.getElementById('modal-overlay'),
    modelRecipe: document.getElementById('recipe-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    uploadForm: document.getElementById('upload-form'),
    model: document,
  };
  ListenerOpenModel() {
    this.#elements.btnAddRecipe.addEventListener(
      'click',
      this.openModel.bind(this),
    );
  }
  openModel() {
    this.#elements.overlay.classList.add('overlay-add-recipe');
    this.#elements.overlay.classList.add('is-open');
    this.#elements.modelRecipe.setAttribute('aria-modal', 'true');
    this.#elements.modelRecipe.classList.add('is-open');
  }
  closeModel() {
    this.#elements.overlay.classList.remove('overlay-add-recipe');
    this.#elements.overlay.classList.remove('is-open');
    this.#elements.modelRecipe.setAttribute('aria-modal', 'false');
    this.#elements.modelRecipe.classList.remove('is-open');
  }
  closeModelHandler() {
    this.#elements.closeModalBtn.addEventListener(
      'click',
      this.closeModel.bind(this),
    );
    this.#elements.overlay.addEventListener(
      'click',
      this.closeModel.bind(this),
    );
    document.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        this.#elements.modelRecipe.classList.contains('is-open')
      ) {
        this.closeModel();
      }
    });
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
}
export default new AddRecipe();
