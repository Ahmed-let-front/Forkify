class View {
  #elements = {
    popup: document.querySelector('.popup'),
    iconPopup: document.querySelector('.icon-popup'),
    popupMsg: document.querySelector('.popup-msg'),
    closeBtn: document.getElementById('close-popup-btn'),
    containerBtnsPagination: document.getElementById('pagination-container'),
  };
  renderSkeltonRes(parentEl) {
    const markup = `
      <li class="preview preview--stagger-1">
        <figure class="preview__fig">
          <img class="skeleton" />
          <figcaption class="preview__data">
            <h2 class="skeleton skeleton--author"></h2>
            <p class="skeleton skeleton--title"></p>
          </figcaption>
        </figure>
      </li>
      <li class="preview preview--stagger-2">
        <figure class="preview__fig">
          <img class="skeleton" />
          <figcaption class="preview__data">
            <h2 class="skeleton skeleton--author"></h2>
            <p class="skeleton skeleton--title"></p>
          </figcaption>
        </figure>
      </li>
      <li class="preview preview--stagger-3">
        <figure class="preview__fig">
          <img class="skeleton" />
          <figcaption class="preview__data">
            <h2 class="skeleton skeleton--author"></h2>
            <p class="skeleton skeleton--title"></p>
          </figcaption>
        </figure>
      </li>
    `;
    parentEl.innerHTML = markup;
  }
  #generateMarkupSpiner() {
    return `
      <div class="flex justify-center items-center py-16" id="spinner">
        <div class="w-12 h-12 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin-slow"></div>
      </div> `;
  }
  renderSpinner(parentEl) {
    parentEl.innerHTML = this.#generateMarkupSpiner();
  }
  addHandlerClosePopup() {
    this.#elements.closeBtn.addEventListener('click', () => this.removePoup(0));
  }
  showContainerBtnsPagination() {
    this.#elements.containerBtnsPagination.classList.remove('hidden-container');
  }
  /**
   * @param {string} message
   * @param {string} [icon] - HTML entity rendered as the popup icon.
   */
  showPopup(message, icon = '&#10003;') {
    this.#elements.popup.classList.add('is-open');
    this.#elements.iconPopup.innerHTML = icon;
    this.#elements.popupMsg.textContent = message;
    this.removePoup();
  }
  /**
   * Auto-dismisses the popup after the given delay; the close button relies
   * on passing 0 for an immediate hide.
   * @param {number} [s] - Delay in seconds before dismissal.
   */
  removePoup(s = 5) {
    setTimeout(
      () => this.#elements.popup.classList.remove('is-open'),
      1000 * s,
    );
  }
}
export default new View();
