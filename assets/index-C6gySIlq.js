(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://forkify-api.jonas.io/api/v2/recipes`,t=`3a0183eb-b5f9-4b8d-a19e-d6a0d701a7b0`,n=e=>new Promise((t,n)=>{setTimeout(()=>{n(Error(`Request took long time! Timout after ${e} second`))},1e3*e)}),r=async(e,t)=>{let r=t?fetch(e,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}):fetch(e),i=await Promise.race([r,n(10)]),a=await i.json(),o=`${a.message} (${i.status})`;if(!i.ok||a.results===0)throw Error(o);return a},i={recipe:{},search:{query:``,results:[],currPage:1,get maxItmes(){return Math.ceil(this.results.length/7)}},bookmarks:{countBooMarks:0,bookmarksArr:[]}},a=e=>{let t=e?.data?.recipe||e.data.recipes;return{id:t?.id||``,title:t?.title||``,publisher:t?.publisher||``,sourceUrl:t?.source_url||``,image:t?.image_url||``,servings:t?.servings||1,cookingTime:t?.cooking_time||0,ingredients:t?.ingredients||[],...t?.key&&{key:t.key}}},o=async n=>{i.recipe=a(await r(`${e}/${n}?key=${t}`)),i.bookmarks.bookmarksArr?.some(e=>e.id===n)?i.recipe.bookMarked=!0:i.recipe.bookMarked=!1},s=e=>{if(e>=1)return e;let t=10**e.toString().split(`.`)[1].length,n=e*t,r=(e,t)=>t===0?e:r(t,e%t),i=r(t,n);return`${n/i}/${t/i}`},c=(e=i.search.currPage)=>{i.search.currPage=e;let t=(e-1)*7,n=e*7;return i.search.results.slice(t,n)},l=async n=>{i.search.query=n;let a=await r(`${e}?search=${i.search.query}&key=${t}`);return i.search.results=a.data.recipes,i.search.currPage=1,c()},u=()=>i.search.results.length<=7,d=()=>(i.search.currPage===i.search.maxItmes&&(i.search.currPage=0),c(++i.search.currPage)),f=()=>(i.search.currPage===1&&(i.search.currPage=i.search.maxItmes+1),c(--i.search.currPage)),p=function(e){e!==0&&(i.recipe.ingredients.forEach(t=>{t.quantity&&=t.quantity*e/i.recipe.servings}),i.recipe.servings=e)},m=()=>{i.bookmarks.countBooMarks=i.bookmarks.bookmarksArr.length},h=e=>{i.bookmarks.bookmarksArr.push(e),e.id===i.recipe.id&&(i.recipe.bookMarked=!0),m();let t={bookMarksArr:i.bookmarks.bookmarksArr,countBookMarks:i.bookmarks.countBooMarks};localStorage.setItem(`bookMarkState`,JSON.stringify(t))},g=e=>{i.bookmarks.bookmarksArr?.some(t=>t.id===e.id)&&(i.recipe.bookMarked=!1),i.bookmarks.bookmarksArr=i.bookmarks.bookmarksArr.filter(t=>t.id!==e.id),m();let t={bookMarksArr:i.bookmarks.bookmarksArr,countBookMarks:i.bookmarks.countBooMarks};localStorage.setItem(`bookMarkState`,JSON.stringify(t))},_=()=>{let e=JSON.parse(localStorage.getItem(`bookMarkState`));if(!e)return;let{bookMarksArr:t,countBookMarks:n}=e;i.bookmarks.bookmarksArr=t,i.bookmarks.countBooMarks=n},v=async n=>{let o=Object.entries(n).filter(e=>e[0].startsWith(`ingredient`)&&e[1]!==``).map(e=>{let t=e[1].split(`,`).map(e=>e.trim());if(t.length!==3)throw Error(`Wrong Ingredient Format`);let[n,r,i]=t;return{quantity:n?+n:null,unit:r,description:i}}),s={title:n.title,source_url:n.sourceUrl,image_url:n.image,publisher:n.publisher,cooking_time:+n.cookingTime,servings:+n.servings,ingredients:o},c=await r(`${e}?key=${t}`,s);console.log(c),i.recipe=a(c),h(i.recipe)},y=new class{#e={popup:document.querySelector(`.popup`),iconPopup:document.querySelector(`.icon-popup`),popupMsg:document.querySelector(`.popup-msg`),closeBtn:document.getElementById(`close-popup-btn`),containerBtnsPagination:document.getElementById(`pagination-container`)};renderSkeltonRes(e){e.innerHTML=`
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
    `}#t(){return`
      <div class="flex justify-center items-center py-16" id="spinner">
        <div class="w-12 h-12 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin-slow"></div>
      </div> `}renderSpinner(e){e.innerHTML=this.#t()}addHandlerClosePopup(){this.#e.closeBtn.addEventListener(`click`,()=>this.removePoup(0))}showContainerBtnsPagination(){this.#e.containerBtnsPagination.classList.remove(`hidden-container`)}showPopup(e,t=`&#10003;`){this.#e.popup.classList.add(`is-open`),this.#e.iconPopup.innerHTML=t,this.#e.popupMsg.textContent=e,this.removePoup()}removePoup(e=5){setTimeout(()=>this.#e.popup.classList.remove(`is-open`),1e3*e)}},b=new class{#e=document.getElementById(`recipe-container`);#t;get parentEl(){return this.#e}render(e){this.#t=e,this.#e.innerHTML=this.#n()}#n(){return`                
            <figure class="relative h-120 overflow-hidden after:inset-0 after:absolute after:backdrop-brightness-55">
                <img
                    src="${this.#t.image}"
                    alt="${this.#t.title} photo"
                    class="w-full h-full object-cover block transition-transform duration-700 hover:scale-105"
                />
                <figcaption>
                    <h2
                    class="absolute bottom-6 left-1/2 -translate-x-1/2 md:whitespace-nowrap text-center text-white font-extrabold text-xl md:text-3xl tracking-tight leading-tight uppercase drop-shadow-md bg-gradient-warm px-6 py-2 rounded-2xl z-10"
                    >
                    ${this.#t.title}
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
                    <span>${this.#t.cookingTime}</span>
                    <span class="font-normal text-charcoal-400">minutes</span>
                </div>

                <div class="flex items-center gap-3 text-charcoal-600 font-bold">
                    <svg class="w-6 h-6 text-primary-500">
                    <use href="./icons.svg#icon-users"></use>
                    </svg>
                    <output class="ser-count">${this.#t.servings}</output>
                    <span class="font-normal text-charcoal-400">servings</span>

                    <div class="flex items-center gap-1 ml-2" id="container-update-btn-ing">
                    <button
                        class="btn--tiny update-ing-btn dcreaseServingsBtn"
                        data-update-to="${this.#t.servings-1}"
                    >
                        <svg><use href="./icons.svg#icon-minus-circle"></use></svg>
                    </button>
                    <button
                        class="btn--tiny update-ing-btn increaseServingsBtn"
                        data-update-to="${this.#t.servings+1}"
                    >
                        <svg><use href="./icons.svg#icon-plus-circle"></use></svg>
                    </button>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <div class="btn--round bg-primary-50 [background-image:none] ${this.#t.key?``:`hidden`}">
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
                    ${this.#r()}
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
                    <span class="font-bold text-charcoal-700">${this.#t.publisher}</span
                    >. Please check out directions at their website.
                </p>
                <a
                    class="btn btn--small mt-2 text-base md:text-lg"
                    href="${this.#t.sourceUrl}"
                    target="_blank"
                >
                    <span>Directions</span>
                    <svg><use href="./icons.svg#icon-arrow-right"></use></svg>
                </a>
                </div>`}#r(){return this.#t.ingredients.map(e=>`
                    <li class="recipe__ingredient text-xl text-charcoal-600">
                            <svg class="w-5 h-5 text-primary-500 shrink-0"><use href="./icons.svg#icon-check"></use></svg>
                            <p>
                            <strong class="font-bold text-charcoal-800">${e.quantity?s(e.quantity):``} ${e.unit}</strong>
                            <span>${e.description}</span>
                            </p>
                        </li>
                    `).join(``)}renderInitContent(){this.#e.innerHTML=`
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
        </div>`}addHandlerRender(e){[`hashchange`,`load`].forEach(t=>window.addEventListener(t,e))}addHandlerUpdateIngBtn(e){this.#e.querySelector(`#container-update-btn-ing`).addEventListener(`click`,t=>{let n=t.target.closest(`.update-ing-btn`);n&&e(+n.dataset.updateTo)})}renderNewIng(e,t){let n=this.#r(e),r=this.#e.querySelector(`.increaseServingsBtn`),i=this.#e.querySelector(`.dcreaseServingsBtn`);this.#e.querySelector(`#list-container-ing`).innerHTML=n,this.#e.querySelector(`.ser-count`).textContent=t,r.dataset.updateTo=t+1,i.dataset.updateTo=t-1}},x=new class{#e;#t={formSearch:document.getElementById(`search-form`),searchInput:document.getElementById(`search-input`),searchResContianer:document.getElementById(`search-res-container`),prevPageNum:document.querySelector(`.prev-page-num`),nextPageNum:document.querySelector(`.next-page-num`),containerBtnsPagination:document.getElementById(`pagination-container`),bookmarksPanel:document.getElementById(`bookmarks-panel`)};get parentEl(){return this.#e}#n(e){return`
          <li class="preview">
            <a href="#${e.id}" class="list-result flex flex-col md:flex-row items-center gap-8 p-4 sm:p-5 rounded-3xl bg-cream-50/60 hover:bg-cream-100/80 border border-cream-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
              <div class="preview__fig relative w-full sm:w-28 h-48 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-cream-200" role="img" aria-label="${e.title} photo">
                <img 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src="${e.image_url}" 
                  alt="${e.title}"
                  aria-hidden="true"
                />
              </div>
              <div class="gap-4 flex flex-col justify-center w-full text-center sm:text-left transition-transform duration-500 group-hover:translate-x-4" role="group" aria-label="Recipe details">
                <h2 class="title text-xl md:text-2xl font-extrabold text-charcoal-800 tracking-tight group-hover:text-primary-600 transition-colors">
                  ${e.title}
                </h2>
                <p class="author text-base md:text-lg font-semibold uppercase tracking-wider text-charcoal-400">
                  ${e.publisher}
                </p>
              </div>
              <div class="btn--round bg-primary-50 [background-image:none] ${e.key?``:`hidden`}">
                <svg><use href="./icons.svg#icon-user"></use></svg>
              </div>
            </a>
          </li> `}#r(){return this.#t.searchInput.value.trim()}injectionMarkupListContainer(){if(document.getElementById(`results-list`))return;let e=document.getElementById(`welcome-view`);e&&e.remove(),this.#t.searchResContianer.insertAdjacentHTML(`afterbegin`,`
     <ul class="flex flex-col gap-4" id="results-list"></ul>
    `),this.#e=document.getElementById(`results-list`)}renderResContainerList(e){this.#t.searchInput.value=``;let t=``;e.forEach(e=>{t+=this.#n(e)}),this.#e.innerHTML=t}renderPageCount(e){this.#t.containerBtnsPagination.querySelector(`.page-count`).textContent=e}returnToWelcomeView(){this.#t.searchResContianer.querySelectorAll(`& > *:not(footer)`).forEach(e=>e.remove()),this.#t.searchResContianer.insertAdjacentHTML(`afterbegin`,`
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
        `)}unFoucsOnSerchInput(){document.activeElement.blur()}getQueryFromClickBtn(e){return e.target.dataset.query}renderPageNum(e,t){this.#t.nextPageNum.textContent=e===t?1:e+1,this.#t.prevPageNum.textContent=e===1?t:e-1}removeAnyListSelcted(e){e&&e.querySelector(`.bg-cream-200`)?.classList.remove(`bg-cream-200`)}addHandlerListsResults(){this.#e.addEventListener(`click`,e=>{let t=e.target.closest(`.list-result`);t?.classList.contains(`bg-cream-200`)||(this.removeAnyListSelcted(this.#t.bookmarksPanel),this.removeAnyListSelcted(e.currentTarget),t&&t.classList.add(`bg-cream-200`))})}addHandlerBtnsWelcomeView(e){document.querySelector(`.btns-welcome-view`).addEventListener(`click`,t=>{t.target.classList.contains(`btn-welcome-view`)&&e(t)})}addHandlerRenderSearchRes(e){this.#t.formSearch.addEventListener(`submit`,t=>{t.preventDefault(),e(this.#r())})}},S=new class{parentEl;#e={prevPageBtn:document.getElementById(`prev-page-btn`),nextPageBtn:document.getElementById(`next-page-btn`)};setParentEl(){this.parentEl=document.getElementById(`results-list`)}addHandlerPangationNext(e){this.setParentEl(),this.#e.nextPageBtn.addEventListener(`click`,e)}addHandlerPangationPrev(e){this.setParentEl(),this.#e.prevPageBtn.addEventListener(`click`,e)}},C=new class{#e=document.getElementById(`recipe-container`);#t={bookmarkBtn:document.getElementById(`toggle-bookmarks-btn`),bookMarkList:document.querySelector(`.bookmarks`),overlay:document.getElementById(`modal-overlay`)};addHandlerBookMark(e){this.#e.addEventListener(`click`,t=>{t.target.closest(`.btn--bookmark`)&&e()})}toogleRenderBookmark(e){if(!e.bookMarked){this.#e.querySelector(`.btn--bookmark`).querySelector(`use`).setAttribute(`href`,`./icons.svg#icon-bookmark-2`);return}this.#e.querySelector(`.btn--bookmark`).querySelector(`use`).setAttribute(`href`,`./icons.svg#icon-bookmark-fill`)}updateUiBookMarkCount(e){let t=document.getElementById(`bookmark-count`);t.textContent=e}#n(e){return`
        <li class="preview-list" data-id="${e.id}">
            <a href="#${e.id}" class="list-result flex items-center gap-5 p-4 rounded-2xl bg-cream-50/60 hover:bg-cream-100/80 border border-cream-200/60 transition-all duration-300 hover:shadow-lg  group">
                <div class="preview__fig relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-cream-200 shadow-sm" role="img" aria-label="${e.title} photo">
                <img 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    src="${e.image}" 
                    alt="${e.title}"
                />
                </div>
                <div class="flex flex-col justify-center min-w-0 flex-1 text-left gap-1.5" role="group" aria-label="Recipe details">
                <h2 class="title text-lg font-extrabold text-charcoal-800 tracking-tight truncate group-hover:text-primary-600 transition-colors">
                    ${e.title}
                </h2>
                <p class="author text-sm font-bold uppercase tracking-wider text-charcoal-400 truncate">
                    ${e.publisher}
                </p>
                </div>
                <div class="btn--round bg-primary-50 [background-image:none] ${e.key?``:`hidden`}">
                <svg><use href="./icons.svg#icon-user"></use></svg>
              </div>
            </a>
         </li>
    `}renderRecipes(e){e.length===1&&(this.#t.bookMarkList.innerHTML=``);let t=e.at(-1),n=this.#n(t);this.#t.bookMarkList.insertAdjacentHTML(`beforeend`,n)}renderRecipesFromLocalStortge(e){let t=e.map(e=>this.#n(e)).join(``);this.#t.bookMarkList.innerHTML=t}renderToInitShape(){this.#t.bookMarkList.innerHTML=`
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
    `}removeAnyListSelcted(e){e&&e.querySelector(`.bg-cream-200`)?.classList.remove(`bg-cream-200`)}removeBookmark(e){let t=e.id,n=this.#t.bookMarkList.querySelector(`[data-id="${t}"]`);n&&(n.remove(),this.#t.bookMarkList.children.length===0&&this.renderToInitShape())}addHandlerListsBookMarks(){document.getElementById(`bookmarks-panel`).addEventListener(`click`,e=>{let t=e.target.closest(`.preview-list`);if(t?.classList.contains(`bg-cream-200`))return;let n=document.getElementById(`results-list`);this.removeAnyListSelcted(n),this.removeAnyListSelcted(e.currentTarget),t.classList.add(`bg-cream-200`)})}autoSelctedAfterReload(e){this.#t.bookMarkList.querySelectorAll(`.preview-list`).forEach(t=>{let n=t.dataset.id;n&&n===e&&t.classList.add(`bg-cream-200`)})}toogleBookMarkListShape(){this.#t.bookMarkList.classList.toggle(`is-open`),this.#t.overlay.classList.toggle(`is-open`)}addHandlerBookMarkBtn(e){this.#t.bookmarkBtn.addEventListener(`click`,e)}handlerCloseList(){this.#t.overlay.addEventListener(`click`,e=>{this.#t.bookMarkList.classList.remove(`is-open`),e.currentTarget.classList.remove(`is-open`)}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.#t.bookMarkList.classList.contains(`is-open`)&&(this.#t.bookMarkList.classList.remove(`is-open`),this.#t.overlay.classList.remove(`is-open`))})}},w=new class{parentEl=document.getElementById(`recipe-modal`);#e={btnAddRecipe:document.getElementById(`open-modal-btn`),overlay:document.getElementById(`modal-overlay`),modelRecipe:document.getElementById(`recipe-modal`),closeModalBtn:document.getElementById(`close-modal-btn`),uploadForm:document.getElementById(`upload-form`),model:document};ListenerOpenModel(){this.#e.btnAddRecipe.addEventListener(`click`,this.openModel.bind(this))}openModel(){this.#e.overlay.classList.add(`overlay-add-recipe`),this.#e.overlay.classList.add(`is-open`),this.#e.modelRecipe.setAttribute(`aria-modal`,`true`),this.#e.modelRecipe.classList.add(`is-open`)}closeModel(){this.#e.overlay.classList.remove(`overlay-add-recipe`),this.#e.overlay.classList.remove(`is-open`),this.#e.modelRecipe.setAttribute(`aria-modal`,`false`),this.#e.modelRecipe.classList.remove(`is-open`)}closeModelHandler(){this.#e.closeModalBtn.addEventListener(`click`,this.closeModel.bind(this)),this.#e.overlay.addEventListener(`click`,this.closeModel.bind(this)),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.#e.modelRecipe.classList.contains(`is-open`)&&this.closeModel()})}addHandlerUpload(e){this.#e.uploadForm.addEventListener(`submit`,function(t){t.preventDefault();let n=[...new FormData(this)];e(Object.fromEntries(n))})}},T=async()=>{try{let e=window.location.hash.slice(1);if(!e)return;y.renderSpinner(b.parentEl),await o(e),b.render(i.recipe),b.addHandlerUpdateIngBtn(M),C.toogleRenderBookmark(i.recipe)}catch(e){b.renderInitContent(),y.showPopup(e.message,`&times;`)}},E=()=>{if(_(),C.updateUiBookMarkCount(i.bookmarks.countBooMarks),i.bookmarks.bookmarksArr.length===0)return;C.renderRecipesFromLocalStortge(i.bookmarks.bookmarksArr);let e=window.location.hash.slice(1);C.autoSelctedAfterReload(e)},D=async e=>{x.injectionMarkupListContainer(),y.renderSkeltonRes(x.parentEl),x.addHandlerListsResults(),x.unFoucsOnSerchInput(),S.addHandlerPangationNext(A),S.addHandlerPangationPrev(j),x.renderResContainerList(await l(e)),x.renderPageNum(i.search.currPage,i.search.maxItmes),x.renderPageCount(i.search.maxItmes),!u()&&y.showContainerBtnsPagination()},O=async e=>{try{if(e===``)return;await D(e)}catch(e){x.returnToWelcomeView(),x.addHandlerBtnsWelcomeView(k),y.showPopup(e.message,`&times;`)}},k=async e=>{try{await D(x.getQueryFromClickBtn(e))}catch(e){x.returnToWelcomeView(),x.addHandlerBtnsWelcomeView(k),y.showPopup(e.message,`&times;`)}},A=()=>{y.renderSkeltonRes(S.parentEl);let e=d();x.renderResContainerList(e),x.renderPageNum(i.search.currPage,i.search.maxItmes)},j=()=>{y.renderSkeltonRes(S.parentEl);let e=f();x.renderResContainerList(e),x.renderPageNum(i.search.currPage,i.search.maxItmes)},M=e=>{p(e),b.renderNewIng(i.recipe.ingredients,i.recipe.servings)},N=()=>{g(i.recipe),C.updateUiBookMarkCount(i.bookmarks.countBooMarks),C.removeBookmark(i.recipe),C.toogleRenderBookmark(i.recipe)};b.addHandlerRender(T),x.addHandlerRenderSearchRes(O),x.addHandlerBtnsWelcomeView(k),C.addHandlerBookMark(()=>{if(i.recipe.bookMarked){N();return}h(i.recipe),C.renderRecipes(i.bookmarks.bookmarksArr),C.updateUiBookMarkCount(i.bookmarks.countBooMarks),C.toogleRenderBookmark(i.recipe)}),C.addHandlerBookMarkBtn(()=>C.toogleBookMarkListShape()),y.addHandlerClosePopup(),C.addHandlerListsBookMarks(),C.handlerCloseList(),w.ListenerOpenModel(),w.closeModelHandler(),w.addHandlerUpload(async e=>{try{w.closeModel(),y.renderSpinner(b.parentEl),await v(e),b.render(i.recipe),C.toogleRenderBookmark(i.recipe),C.updateUiBookMarkCount(i.bookmarks.countBooMarks),C.renderRecipes(i.bookmarks.bookmarksArr),window.history.pushState(null,``,`#${i.recipe.id?i.recipe.id:``}`)}catch(e){y.showPopup(e.message,`&times;`),w.openModel()}}),E();