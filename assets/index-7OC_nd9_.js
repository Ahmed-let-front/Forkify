(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://forkify-api.jonas.io/api/v2/recipes`,t=`https://api.nal.usda.gov/fdc/v1`,n=`3a0183eb-b5f9-4b8d-a19e-d6a0d701a7b0`,r=`vflxkhVIcdcMSjzbFh5jdxRjmqVkBukVvDdD5kJJ`,i=e=>new Promise((t,n)=>{setTimeout(()=>{n(Error(`Request took long time! Timout after ${e} second`))},1e3*e)}),a=async(e,t)=>{let n=t?fetch(e,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}):fetch(e),r=await Promise.race([n,i(10)]),a=await r.json(),o=`${a.message} (${r.status})`;if(!r.ok||a.results===0)throw Error(o);return a},o={recipe:{},search:{query:``,results:[],currPage:1,get maxItmes(){return Math.ceil(this.results.length/7)}},bookmarks:{countBooMarks:0,bookmarksArr:[]},shoppingListArr:[],mealPlanArr:[]},s=e=>{let t=e?.data?.recipe||e.data.recipes;return{id:t?.id||``,title:t?.title||``,publisher:t?.publisher||``,sourceUrl:t?.source_url||``,image:t?.image_url||``,servings:t?.servings||1,cookingTime:t?.cooking_time||0,ingredients:t?.ingredients||[],...t?.key&&{key:t.key}}},c=async t=>{o.recipe=s(await a(`${e}/${t}?key=${n}`)),o.bookmarks.bookmarksArr?.some(e=>e.id===t)?o.recipe.bookMarked=!0:o.recipe.bookMarked=!1},l=e=>{if(e>=1)return e;let t=10**e.toString().split(`.`)[1].length,n=e*t,r=(e,t)=>t===0?e:r(t,e%t),i=r(t,n);return`${n/i}/${t/i}`},u=(e=o.search.currPage,t)=>{o.search.currPage=e;let n=(e-1)*7,r=e*7;return t===`detailed`?o.search.detailedResults.slice(n,r):o.search.results.slice(n,r)},d=async t=>{o.search.query=t;let r=await a(`${e}?search=${o.search.query}&key=${n}`);return o.search.results=r.data.recipes,o.search.currPage=1,u()},f=()=>o.search.results.length<=7,p=()=>(o.search.currPage===o.search.maxItmes&&(o.search.currPage=0),u(++o.search.currPage)),m=()=>(o.search.currPage===1&&(o.search.currPage=o.search.maxItmes+1),u(--o.search.currPage)),h=function(e){e!==0&&(o.recipe.ingredients.forEach(t=>{t.quantity&&=t.quantity*e/o.recipe.servings}),o.recipe.servings=e)},g=()=>{o.bookmarks.countBooMarks=o.bookmarks.bookmarksArr.length},_=e=>{o.bookmarks.bookmarksArr.push(e),e.id===o.recipe.id&&(o.recipe.bookMarked=!0),g();let t={bookMarksArr:o.bookmarks.bookmarksArr,countBookMarks:o.bookmarks.countBooMarks};localStorage.setItem(`bookMarkState`,JSON.stringify(t))},v=e=>{o.bookmarks.bookmarksArr?.some(t=>t.id===e.id)&&(o.recipe.bookMarked=!1),o.bookmarks.bookmarksArr=o.bookmarks.bookmarksArr.filter(t=>t.id!==e.id),g();let t={bookMarksArr:o.bookmarks.bookmarksArr,countBookMarks:o.bookmarks.countBooMarks};localStorage.setItem(`bookMarkState`,JSON.stringify(t))},y=()=>{let e=JSON.parse(localStorage.getItem(`bookMarkState`));if(!e)return;let{bookMarksArr:t,countBookMarks:n}=e;o.bookmarks.bookmarksArr=t,o.bookmarks.countBooMarks=n},b=async t=>{let r=Object.entries(t).filter(e=>e[0].startsWith(`ingredient`)&&e[1]!==``).map(e=>{let t=e[1].split(`,`).map(e=>e.trim());if(t.length!==3)throw Error(`Wrong Ingredient Format`);let[n,r,i]=t;return{quantity:n?+n:null,unit:r,description:i}}),i={title:t.title,source_url:t.sourceUrl,image_url:t.image,publisher:t.publisher,cooking_time:+t.cookingTime,servings:+t.servings,ingredients:r};o.recipe=s(await a(`${e}?key=${n}`,i)),_(o.recipe)},x=async t=>{if(!o.search.detailedResults?.some(e=>e.id===o.search.results[0].id)){let t=o.search.results.map(e=>e.id);o.search.detailedResults=await Promise.all(t.map(t=>a(`${e}/${t}?key=${n}`))),o.search.detailedResults=o.search.detailedResults.map(e=>e.data.recipe)}return t.target.value===`duration`?o.search.detailedResults.sort((e,t)=>t.cooking_time-e.cooking_time):o.search.detailedResults.sort((e,t)=>t.ingredients.length-e.ingredients.length),u(o.search.currPage,`detailed`)},S=()=>{if(o.shoppingListArr?.some(e=>e.id===o.recipe.id))throw Error(`This was added previously.`);o.shoppingListArr.push(o.recipe),localStorage.setItem(`shoppingListArr`,JSON.stringify(o.shoppingListArr))},C=e=>{o.shoppingListArr=o.shoppingListArr.filter(t=>t.id!==e),localStorage.setItem(`shoppingListArr`,JSON.stringify(o.shoppingListArr))},w=()=>{o.shoppingListArr=JSON.parse(localStorage.getItem(`shoppingListArr`))||[]},T=async()=>{let e=o.recipe.title.split(` `).slice(0,2).join(` `),n=(await a(`${t}/foods/search?query=${encodeURIComponent(e)}&api_Key=${r}`)).foods[0].fdcId,i=(await a(`${t}/food/${n}?api_Key=${r}`)).foodNutrients.find(e=>e.nutrient?.number===`208`||e.nutrient?.number===`1008`||e.nutrient?.name?.toLowerCase().includes(`energy`));o.recipe.calories=i?Math.round(i.amount):`N/A`},E=e=>{let{day:t,dayOfWeak:n}=e,r={...o.recipe,day:t,dayOfWeak:n};o.mealPlanArr.push(r),localStorage.setItem(`mealPlanArr`,JSON.stringify(o.mealPlanArr))},D=e=>{o.mealPlanArr=o.mealPlanArr.filter(t=>t.id!==e),localStorage.setItem(`mealPlanArr`,JSON.stringify(o.mealPlanArr))},O=new class{#e={popup:document.querySelector(`.popup`),iconPopup:document.querySelector(`.icon-popup`),popupMsg:document.querySelector(`.popup-msg`),closeBtn:document.getElementById(`close-popup-btn`),containerBtnsPagination:document.getElementById(`pagination-container`)};renderSkeltonRes(e){e.innerHTML=`
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
      </div> `}renderSpinner(e){e.innerHTML=this.#t()}addHandlerClosePopup(){this.#e.closeBtn.addEventListener(`click`,()=>this.removePoup(0))}showContainerBtnsPagination(){this.#e.containerBtnsPagination.classList.remove(`hidden-container`)}showPopup(e,t=`&#10003;`){this.#e.popup.classList.add(`is-open`),this.#e.iconPopup.innerHTML=t,this.#e.popupMsg.textContent=e,this.removePoup()}removePoup(e=5){setTimeout(()=>this.#e.popup.classList.remove(`is-open`),1e3*e)}},k=new class{#e=document.getElementById(`recipe-container`);#t;get parentEl(){return this.#e}render(e){this.#t=e,this.#e.innerHTML=this.#n()}#n(){return`                
            <figure class="relative h-120 overflow-hidden after:inset-0 after:absolute after:backdrop-brightness-55">
                <img
                    src="${this.#t.image}"
                    alt="${this.#t.title} photo"
                    class="w-full h-full object-cover block transition-transform duration-700 hover:scale-105"
                />
                <figcaption>
                    <h2
                    class="absolute bottom-6 left-1/2 -translate-x-1/2  text-center text-white font-extrabold text-xl md:text-3xl tracking-tight leading-tight uppercase drop-shadow-md bg-gradient-warm px-6 py-2 rounded-2xl z-10"
                    >
                    ${this.#t.title}
                    </h2>
                </figcaption>
                </figure>
                <div
                class="flex items-center flex-wrap gap-6 relative z-20 justify-around p-8 md:p-10 bg-cream-50/60 backdrop-blur-sm border-b border-cream-200 text-xl md:text-2xl"
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
                <button
                  class="flex items-center gap-4 px-6 py-3.5 rounded-2xl border-4 border-dotted border-orange-400 bg-white text-primary-600 font-bold text-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-orange-500/30 hover:border-orange-500 focus:outline-none focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
                  id="recipe-meal-plan-btn"
                  aria-label="Add to weekly meal plan"
                  title="Add to Meal Plan"
                >
                  <svg class="w-6 h-6 fill-orange-500" aria-hidden="true">
                    <use href="./icons.svg#icon-plus-circle"></use>
                  </svg>
                  <span>Add to Meal Plan</span>
                </button>
        
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
                <button
                  type="button"
                  id="btn-add-to-shopping-list"
                  class="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-primary-500 text-white font-bold text-lg md:text-xl shadow-md hover:bg-primary-600 transition-all duration-300 cursor-pointer mt-8"
                >
                  <svg class="w-6 h-6 fill-current" aria-hidden="true">
                    <use href="./icons.svg#icon-plus-circle"></use>
                  </svg>
                  <span>Add ingredients to shopping list</span>
                </button>
                </div>
                <div class="text-charcoal-600 border-y border-cream-200 p-4 text-center">
                  <p><strong class="font-bold mr-2 text-4xl ml-8">${this.#t.calories}</strong>kcal</p>
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
                            <strong class="font-bold text-charcoal-800">${e.quantity?l(e.quantity):``} ${e.unit}</strong>
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
        </div>`}addHandlerRender(e){[`hashchange`,`load`].forEach(t=>window.addEventListener(t,e))}addHandlerUpdateIngBtn(e){this.#e.querySelector(`#container-update-btn-ing`).addEventListener(`click`,t=>{let n=t.target.closest(`.update-ing-btn`);n&&e(+n.dataset.updateTo)})}renderNewIng(e,t){let n=this.#r(e),r=this.#e.querySelector(`.increaseServingsBtn`),i=this.#e.querySelector(`.dcreaseServingsBtn`);this.#e.querySelector(`#list-container-ing`).innerHTML=n,this.#e.querySelector(`.ser-count`).textContent=t,r.dataset.updateTo=t+1,i.dataset.updateTo=t-1}},A=new class{#e;#t={formSearch:document.getElementById(`search-form`),searchInput:document.getElementById(`search-input`),searchResContianer:document.getElementById(`search-res-container`),prevPageNum:document.querySelector(`.prev-page-num`),nextPageNum:document.querySelector(`.next-page-num`),containerBtnsPagination:document.getElementById(`pagination-container`),bookmarksPanel:document.getElementById(`bookmarks-panel`),sortSelect:document.getElementById(`sort-select`)};get parentEl(){return this.#e}#n(e){return`
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
          </li> `}#r(){return this.#t.searchInput.value.trim()}injectionMarkupListContainer(){if(document.getElementById(`results-list`))return;let e=document.getElementById(`welcome-view`);e&&e.remove(),this.#t.searchResContianer.children[0].insertAdjacentHTML(`afterend`,`
     <ul class="flex flex-col gap-4" id="results-list"></ul>
    `),this.#e=document.getElementById(`results-list`)}renderResContainerList(e){this.#t.searchInput.value=``;let t=``;e.forEach(e=>{t+=this.#n(e)}),this.#e.innerHTML=t}showSortSelect(){this.#t.sortSelect.disabled=!1}hiddenSortSelect(){this.#t.sortSelect.disabled=!0}renderPageCount(e){this.#t.containerBtnsPagination.querySelector(`.page-count`).textContent=e}returnToWelcomeView(){this.#t.searchResContianer.querySelectorAll(`& > *:not(footer, #sort-container)`).forEach(e=>e.remove()),this.#t.sortSelect.insertAdjacentHTML(`afterend`,`
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
        `)}unFoucsOnSerchInput(){document.activeElement.blur()}getQueryFromClickBtn(e){return e.target.dataset.query}renderPageNum(e,t){this.#t.nextPageNum.textContent=e===t?1:e+1,this.#t.prevPageNum.textContent=e===1?t:e-1}removeAnyListSelcted(e){e&&e.querySelector(`.bg-cream-200`)?.classList.remove(`bg-cream-200`)}addHandlerListsResults(){this.#e.addEventListener(`click`,e=>{let t=e.target.closest(`.list-result`);t?.classList.contains(`bg-cream-200`)||(this.removeAnyListSelcted(this.#t.bookmarksPanel),this.removeAnyListSelcted(e.currentTarget),t&&t.classList.add(`bg-cream-200`))})}addHandlerBtnsWelcomeView(e){document.querySelector(`.btns-welcome-view`).addEventListener(`click`,t=>{t.target.classList.contains(`btn-welcome-view`)&&e(t)})}addHandlerRenderSearchRes(e){this.#t.formSearch.addEventListener(`submit`,t=>{t.preventDefault(),e(this.#r())})}addHandlerSortSelect(e){this.#t.sortSelect.addEventListener(`change`,e)}},j=new class{parentEl;#e={prevPageBtn:document.getElementById(`prev-page-btn`),nextPageBtn:document.getElementById(`next-page-btn`)};setParentEl(){this.parentEl=document.getElementById(`results-list`)}addHandlerPangationNext(e){this.setParentEl(),this.#e.nextPageBtn.addEventListener(`click`,e)}addHandlerPangationPrev(e){this.setParentEl(),this.#e.prevPageBtn.addEventListener(`click`,e)}},M=new class{#e=document.getElementById(`recipe-container`);#t={bookmarkBtn:document.getElementById(`toggle-bookmarks-btn`),bookMarkList:document.querySelector(`.bookmarks`),overlay:document.getElementById(`modal-overlay`)};addHandlerBookMark(e){this.#e.addEventListener(`click`,t=>{t.target.closest(`.btn--bookmark`)&&e()})}toogleRenderBookmark(e){if(!e.bookMarked){this.#e.querySelector(`.btn--bookmark`).querySelector(`use`).setAttribute(`href`,`./icons.svg#icon-bookmark-2`);return}this.#e.querySelector(`.btn--bookmark`).querySelector(`use`).setAttribute(`href`,`./icons.svg#icon-bookmark-fill`)}updateUiBookMarkCount(e){let t=document.getElementById(`bookmark-count`);t.textContent=e}#n(e){return`
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
    `}removeAnyListSelcted(e){e&&e.querySelector(`.bg-cream-200`)?.classList.remove(`bg-cream-200`)}removeBookmark(e){let t=e.id,n=this.#t.bookMarkList.querySelector(`[data-id="${t}"]`);n&&(n.remove(),this.#t.bookMarkList.children.length===0&&this.renderToInitShape())}addHandlerListsBookMarks(){document.getElementById(`bookmarks-panel`).addEventListener(`click`,e=>{let t=e.target.closest(`.preview-list`);if(t?.classList.contains(`bg-cream-200`))return;let n=document.getElementById(`results-list`);this.removeAnyListSelcted(n),this.removeAnyListSelcted(e.currentTarget),t.classList.add(`bg-cream-200`)})}autoSelctedAfterReload(e){this.#t.bookMarkList.querySelectorAll(`.preview-list`).forEach(t=>{let n=t.dataset.id;n&&n===e&&t.classList.add(`bg-cream-200`)})}toogleBookMarkListShape(){this.#t.bookMarkList.classList.toggle(`is-open`),this.#t.overlay.classList.toggle(`is-open`)}addHandlerBookMarkBtn(e){this.#t.bookmarkBtn.addEventListener(`click`,e)}handlerCloseList(){this.#t.overlay.addEventListener(`click`,e=>{this.#t.bookMarkList.classList.contains(`is-open`)&&(this.#t.bookMarkList.classList.remove(`is-open`),e.currentTarget.classList.remove(`is-open`))}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.#t.bookMarkList.classList.contains(`is-open`)&&(this.#t.bookMarkList.classList.remove(`is-open`),this.#t.overlay.classList.remove(`is-open`))})}},N=new class{parentEl=document.getElementById(`recipe-modal`);#e={btnAddRecipe:document.getElementById(`open-modal-btn`),overlay:document.getElementById(`modal-overlay`),modelRecipe:document.getElementById(`recipe-modal`),closeModalBtn:document.getElementById(`close-modal-btn`),uploadForm:document.getElementById(`upload-form`),addIngredientBtn:document.getElementById(`add-ingredient-btn`),ingredientInputs:document.getElementById(`ingredientInputs`),inputCount:7,model:document};ListenerOpenModel(){this.#e.btnAddRecipe.addEventListener(`click`,this.openModel.bind(this))}openModel(){this.#e.overlay.classList.add(`overlay-shape-2`),this.#e.overlay.classList.add(`is-open`),this.#e.modelRecipe.setAttribute(`aria-modal`,`true`),this.#e.modelRecipe.classList.add(`is-open`)}closeModel(){this.#e.overlay.classList.remove(`overlay-shape-2`),this.#e.overlay.classList.remove(`is-open`),this.#e.modelRecipe.setAttribute(`aria-modal`,`false`),this.#e.modelRecipe.classList.remove(`is-open`)}closeModelHandler(){this.#e.closeModalBtn.addEventListener(`click`,this.closeModel.bind(this)),this.#e.overlay.addEventListener(`click`,()=>{this.#e.modelRecipe.classList.contains(`is-open`)&&this.closeModel()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.#e.modelRecipe.classList.contains(`is-open`)&&this.closeModel()})}#t(){let e=`
              <div class="flex flex-col">
                <label
                  for="ingredient-${this.#e.inputCount}"
                  class="block text-base md:text-lg font-semibold text-charcoal-700 mb-1"
                  >Ingredient ${this.#e.inputCount}</label
                >
                <input
                  id="ingredient-${this.#e.inputCount}"
                  type="text"
                  name="ingredient-${this.#e.inputCount}"
                  placeholder="Format: Quantity,Unit,Description"
                  class="w-full rounded-xl border border-cream-300 bg-white px-4 py-3 md:py-3.5 text-charcoal-800 placeholder-charcoal-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-lg md:text-xl"
                />
              </div>
    `;return this.#e.inputCount++,e}appendMarkupInputBtn(){this.#e.ingredientInputs.insertAdjacentHTML(`beforeend`,this.#t())}addHandlerUpload(e){this.#e.uploadForm.addEventListener(`submit`,function(t){t.preventDefault();let n=[...new FormData(this)];e(Object.fromEntries(n))})}addHandlerAddInputIngredient(e){this.#e.addIngredientBtn.addEventListener(`click`,e)}},P=new class{#e={ShoppingContainer:document.getElementById(`shopping-list-container`),closeBtn:document.getElementById(`close-btn-shopping-list`),ShoppingBtn:document.getElementById(`shopping-list-btn`),shoppingItemsContainer:document.getElementById(`items-container-shopping`),countRecipesShopping:document.getElementById(`count-recipes-shopping-list`),overlay:document.getElementById(`modal-overlay`)};constructor(){this.handlerCloseModel()}showShoppingContanier(){this.#e.ShoppingContainer.classList.add(`is-open`),this.#e.overlay.classList.add(`is-open`),this.#e.overlay.classList.add(`overlay-shape-2`),this.#e.ShoppingContainer.setAttribute(`aria-modal`,!0)}hiddenShoppingContanier(){this.#e.ShoppingContainer.classList.remove(`is-open`),this.#e.overlay.classList.remove(`is-open`),this.#e.overlay.classList.remove(`overlay-shape-2`),this.#e.ShoppingContainer.setAttribute(`aria-modal`,!1)}handlerCloseModel(){this.#e.overlay.addEventListener(`click`,()=>{this.#e.ShoppingContainer.classList.contains(`is-open`)&&this.hiddenShoppingContanier()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.#e.ShoppingContainer.classList.contains(`is-open`)&&this.hiddenShoppingContanier()})}#t(e){let t=e.at(-1);return`
    <div class="mb-6 p-4 sm:p-6 rounded-2xl bg-cream-50/50 border border-cream-200" data-id="${t.id}" id="item-list">
      <div
        class="flex flex-wrap  sm:items-center justify-between gap-7 mb-4 pb-3 border-b border-cream-200"
      >
        <h3
          class="text-xl md:text-2xl font-bold text-charcoal-800 flex items-center gap-3"
        >
          <span class="w-3.5 h-3.5 rounded-full bg-primary-500 shrink-0"></span>
          ${t.title}
        </h3>
        <img 
            src="${t.image}" 
            alt="${t.title}" 
            class="w-full h-40 object-cover rounded-xl border border-cream-200 shadow-sm"
          />
        <span
          class="self-start sm:self-auto text-lg w-full text-center font-bold mb-3 text-charcoal-500 bg-white px-3 py-1 rounded-xl border border-cream-200"
          >${t.ingredients.length} Ingredients</span
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
        ${t.ingredients.map(e=>`
        <li
            class="flex items-center p-4 rounded-xl bg-white border border-cream-200/60 hover:border-primary-300 transition-all"
          >
            <div class="flex items-center gap-4">
              <span class="text-lg md:text-xl font-medium text-charcoal-700 leading-snug">
                ${e.quantity?`${l(e.quantity)} `:``}
                <span class="text-sm text-charcoal-500">${e.unit||``}</span>
                ${e.description}
              </span>
            </div>
        </li>`).join(``)}
      </ul>
     </div>
    `}#n(e){return`
        ${e.map(e=>`
    <div class="mb-6 p-4 sm:p-6 rounded-2xl bg-cream-50/50 border border-cream-200" data-id="${e.id}" id="item-list">
      <div
        class="flex flex-wrap sm:items-center justify-between gap-7 mb-4 pb-3 border-b border-cream-200"
      >
        <h3
          class="text-xl md:text-2xl font-bold text-charcoal-800 flex items-center gap-3"
        >
          <span class="w-3.5 h-3.5 rounded-full bg-primary-500 shrink-0"></span>
          ${e.title}
        </h3>
        <img 
            src="${e.image}" 
            alt="${e.title}" 
            class="w-full h-40 object-cover rounded-xl border border-cream-200 shadow-sm"
        />
        <span
          class="self-start sm:self-auto text-lg w-full text-center mb-3 font-bold text-charcoal-500 bg-white px-3 py-1 rounded-xl border border-cream-200"
          >${e.ingredients.length} Ingredients</span
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
        ${e.ingredients.map(e=>`
          <li
            class="flex items-center p-4 rounded-xl bg-white border border-cream-200/60 hover:border-primary-300 transition-all"
          >
            <div class="flex items-center gap-4">
              <span class="text-lg md:text-xl font-medium text-charcoal-700 leading-snug">
                ${e.quantity?`${l(e.quantity)} `:``}
                <span class="text-sm text-charcoal-500">${e.unit||``}</span>
                ${e.description}
              </span>
            </div>
          </li>
        `).join(``)}
      </ul>
    </div>
  `).join(``)}
    `}renderItemInShoppingList(e){let t=document.getElementById(`no-shopping-message`);t&&t.remove(),this.#e.shoppingItemsContainer.insertAdjacentHTML(`beforeend`,this.#t(e))}renderItemInShoppingListLocalStortge(e){this.#e.shoppingItemsContainer.innerHTML=this.#n(e)}removeItem(e){document.querySelector(`[data-id="${e}"]`).remove()}renderToInitView(){this.#e.shoppingItemsContainer.innerHTML=`
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
    `}updateCount(e){this.#e.countRecipesShopping.textContent=e.length}addHandlerShoppingBtnShow(e){this.#e.ShoppingBtn.addEventListener(`click`,e)}addHandlerShoppingBtnClose(e){this.#e.closeBtn.addEventListener(`click`,e)}addHandlerAddIngredient(e){document.getElementById(`btn-add-to-shopping-list`).addEventListener(`click`,e)}addHandlerRemoveIngredient(e){this.#e.ShoppingContainer.addEventListener(`click`,t=>{let n=t.target;if(!n.closest(`#delete-item-shopping-list`))return;let r=n.closest(`#item-list`).dataset.id;e(r)})}},F=new class{#e={overlay:document.getElementById(`modal-overlay`),mealPlanContainer:document.getElementById(`meal-plan-modal`),mealPlanGrid:document.getElementById(`meal-plan-grid`),closeBtnContainer:document.getElementById(`close-meal-plan-btn`),showBtn:document.getElementById(`meal-plan-nav-btn`),modelSelect:document.getElementById(`select-day-modal`),closeBtnSelectModel:document.getElementById(`close-select-day-btn`),recipeContainer:document.getElementById(`recipe-container`),daysListContainer:document.getElementById(`days-list-container`),mealPlanCount:document.getElementById(`meal-plan-count`)};constructor(){this.handlerCloseModel(),this.handlerCloseModelSelect()}showModel(){this.#e.mealPlanContainer.classList.add(`is-open`),this.#e.overlay.classList.add(`is-open`),this.#e.overlay.classList.add(`overlay-shape-2`),this.#e.mealPlanContainer.setAttribute(`aria-modal`,!0)}hiddenModel(){this.#e.mealPlanContainer.classList.remove(`is-open`),this.#e.overlay.classList.remove(`is-open`),this.#e.overlay.classList.remove(`overlay-shape-2`),this.#e.mealPlanContainer.setAttribute(`aria-modal`,!1)}showModelSelect(){let e=document.getElementById(`select-day-modal`);e.classList.add(`is-open`),e.setAttribute(`aria-modal`,!0),this.#e.overlay.classList.add(`is-open`),this.#e.overlay.classList.add(`overlay-shape-2`)}hiddenModelSelect(){this.#e.modelSelect.classList.remove(`is-open`),this.#e.modelSelect.setAttribute(`aria-modal`,!1),this.#e.overlay.classList.remove(`is-open`),this.#e.overlay.classList.remove(`overlay-shape-2`)}#t(e){return`
            <div
            class="bg-white rounded-2xl p-4 border border-cream-200 shadow-sm flex flex-col justify-between gap-4 w-full"
            data-id="${e.id}"
            data-dayOfWeek="${e.dayOfWeak}"
            id="item-recipe-meal-plan"
            >
            <div
                class="flex items-center flex-wrap gap-2 justify-between border-b border-cream-100 pb-2"
            >
                <h3 class="font-bold text-primary-600 text-lg">${e.dayOfWeak}</h3>
                <span
                class="text-sm font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-500"
                >Day ${e.day}</span
                >
            </div>
            <div class="flex items-center gap-4">
                <a
                href="#${e.id}"
                id="recipe-item"
                class="bg-white w-full rounded-2xl p-4 border border-cream-200 shadow-sm flex flex-col gap-8 transition-all duration-300 hover:border-primary-300 hover:shadow-md group"
                >
                <img
                    src="${e.image}"
                    alt="${e.title}"
                    class="w-full h-40 object-cover rounded-xl border border-cream-200 shrink-0"
                />
                <div class="flex flex-col gap-2 min-w-0">
                    <h4 class="font-bold text-charcoal-800 text-xl truncate">
                    ${e.title}
                    </h4>
                    <span class="text-sm font-medium text-charcoal-500 truncate"
                    >${e.publisher}</span
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
    `}renderReecipeInMealPlan(e){let t=document.getElementById(`no-meal-message`);t&&t.remove(),this.#e.mealPlanGrid.insertAdjacentHTML(`beforeend`,this.#t(e))}setabledAbilityBtnsSelect(e){e.forEach(e=>{this.#e.daysListContainer.querySelectorAll(`.btn-day-select-day`).forEach(t=>{t.dataset.day===e.dayOfWeak&&(t.disabled=!0)})})}setAbeldBtnsSelect(e){this.#e.daysListContainer.querySelector(`[data-day='${e}']`).disabled=!1}removeItem(e){e.remove()}renderRecipeInMealPlanFromLocalStortge(e){if(!e.length)return;let t=document.getElementById(`no-meal-message`);t&&t.remove();let n=e.map(e=>this.#t(e)).join(``);this.#e.mealPlanGrid.innerHTML=n,this.setabledAbilityBtnsSelect(e)}removeAnySelctedRecipe(){let e=document.getElementById(`results-list`);e?.querySelector(`.bg-cream-200`)&&e.querySelector(`.bg-cream-200`).classList.remove(`bg-cream-200`)}renderToInitView(){this.#e.mealPlanGrid.innerHTML=`
        <div
            class="flex flex-col items-center justify-center text-center py-6 text-charcoal-400 gap-2"
            id="no-meal-message"
          >
            <svg class="w-8 h-8 text-cream-300" aria-hidden="true">
              <use href="./icons.svg#icon-smile-2"></use>
            </svg>
            <p class="text-lg">No meal assigned</p>
        </div>
    `}updateCountRecipes(e){this.#e.mealPlanCount.textContent=e}disabledBtn(e){e.disabled=!0}addHandlerShowBtnModel(e){this.#e.showBtn.addEventListener(`click`,e)}addHandlerHiddenBtnModel(e){this.#e.closeBtnContainer.addEventListener(`click`,e)}addHandlerBtnAdd(e){this.#e.recipeContainer.addEventListener(`click`,t=>{t.target.closest(`#recipe-meal-plan-btn`)&&e()})}addHandlerSelectBtn(e){this.#e.daysListContainer.addEventListener(`click`,t=>{let n=t.target;if(!n.closest(`#day-item`))return;let r=n.closest(`#day-item`),i=r.dataset.index,a=r.querySelector(`.btn-day-select-day`);e({day:i,dayOfWeak:r.querySelector(`.btn-day-select-day`).dataset.day,btn:a})})}addHandlerHiddenBtnModelSelect(e){this.#e.closeBtnSelectModel.addEventListener(`click`,e)}addHandlerClickOfRecipeInList(e){this.#e.mealPlanGrid.addEventListener(`click`,t=>{t.target.closest(`#recipe-item`)&&e()})}addHandlerDeleteBtn(e){this.#e.mealPlanGrid.addEventListener(`click`,t=>{let n=t.target;n.closest(`#delete-item-meal-plan`)&&e(n.closest(`#item-recipe-meal-plan`))})}handlerCloseModel(){this.#e.overlay.addEventListener(`click`,()=>{this.#e.mealPlanContainer.classList.contains(`is-open`)&&this.hiddenModel()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.#e.mealPlanContainer.classList.contains(`is-open`)&&this.hiddenModel()})}handlerCloseModelSelect(){this.#e.overlay.addEventListener(`click`,()=>{this.#e.modelSelect.classList.contains(`is-open`)&&this.hiddenModelSelect()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.#e.modelSelect.classList.contains(`is-open`)&&this.hiddenModelSelect()})}},I=async()=>{try{let e=window.location.hash.slice(1);if(!e)return;O.renderSpinner(k.parentEl),await c(e),await T(),k.render(o.recipe),P.addHandlerAddIngredient(Q),k.addHandlerUpdateIngBtn(U),M.toogleRenderBookmark(o.recipe)}catch(e){k.renderInitContent(),O.showPopup(e.message,`&times;`)}},L=()=>{if(y(),M.updateUiBookMarkCount(o.bookmarks.countBooMarks),o.bookmarks.bookmarksArr.length===0)return;M.renderRecipesFromLocalStortge(o.bookmarks.bookmarksArr);let e=window.location.hash.slice(1);M.autoSelctedAfterReload(e)},R=async e=>{A.injectionMarkupListContainer(),O.renderSkeltonRes(A.parentEl),A.addHandlerListsResults(),A.unFoucsOnSerchInput(),j.addHandlerPangationNext(V),j.addHandlerPangationPrev(H),A.renderResContainerList(await d(e)),A.renderPageNum(o.search.currPage,o.search.maxItmes),A.renderPageCount(o.search.maxItmes),!f()&&O.showContainerBtnsPagination()},z=async e=>{try{if(e===``)return;A.hiddenSortSelect(),await R(e),A.showSortSelect()}catch(e){A.returnToWelcomeView(),A.addHandlerBtnsWelcomeView(B),O.showPopup(e.message,`&times;`)}},B=async e=>{try{let t=A.getQueryFromClickBtn(e);A.hiddenSortSelect(),await R(t),A.showSortSelect()}catch(e){A.returnToWelcomeView(),A.addHandlerBtnsWelcomeView(B),O.showPopup(e.message,`&times;`)}},V=()=>{O.renderSkeltonRes(j.parentEl);let e=p();A.renderResContainerList(e),A.renderPageNum(o.search.currPage,o.search.maxItmes)},H=()=>{O.renderSkeltonRes(j.parentEl);let e=m();A.renderResContainerList(e),A.renderPageNum(o.search.currPage,o.search.maxItmes)},U=e=>{h(e),k.renderNewIng(o.recipe.ingredients,o.recipe.servings)},W=()=>{v(o.recipe),M.updateUiBookMarkCount(o.bookmarks.countBooMarks),M.removeBookmark(o.recipe),M.toogleRenderBookmark(o.recipe)},G=()=>{if(o.recipe.bookMarked){W();return}_(o.recipe),M.renderRecipes(o.bookmarks.bookmarksArr),M.updateUiBookMarkCount(o.bookmarks.countBooMarks),M.toogleRenderBookmark(o.recipe)},K=async e=>{try{N.closeModel(),O.renderSpinner(k.parentEl),await b(e),k.render(o.recipe),M.toogleRenderBookmark(o.recipe),M.updateUiBookMarkCount(o.bookmarks.countBooMarks),M.renderRecipes(o.bookmarks.bookmarksArr),window.history.pushState(null,``,`#${o.recipe.id?o.recipe.id:``}`)}catch(e){k.renderInitContent(),O.showPopup(e.message,`&times;`),N.openModel()}},q=async e=>{try{A.renderResContainerList(await x(e))}catch(e){O.showPopup(e.message,`&times;`)}},J=()=>{N.appendMarkupInputBtn(),O.showPopup(`One has been added.`)},Y=()=>M.toogleBookMarkListShape(),X=()=>P.showShoppingContanier(),Z=()=>P.hiddenShoppingContanier(),Q=()=>{try{S(),P.renderItemInShoppingList(o.shoppingListArr),P.updateCount(o.shoppingListArr),O.showPopup(`Done. Take a look at the shopping List.`)}catch(e){O.showPopup(e.message,`&times;`)}};k.addHandlerRender(I),A.addHandlerRenderSearchRes(z),A.addHandlerBtnsWelcomeView(B),M.addHandlerBookMark(G),M.addHandlerBookMarkBtn(Y),A.addHandlerSortSelect(q),N.addHandlerAddInputIngredient(J),P.addHandlerShoppingBtnShow(X),P.addHandlerShoppingBtnClose(Z),P.addHandlerRemoveIngredient(e=>{C(e),P.removeItem(e),P.updateCount(o.shoppingListArr),O.showPopup(`Successfully removed.`),o.shoppingListArr.length===0&&P.renderToInitView()}),F.addHandlerShowBtnModel(()=>{F.showModel()}),F.addHandlerHiddenBtnModel(()=>F.hiddenModel()),F.addHandlerBtnAdd(()=>{if(o.mealPlanArr.some(e=>e.id===o.recipe.id)){O.showPopup(`It was added previously`,`&times;`);return}F.showModelSelect()}),F.addHandlerHiddenBtnModelSelect(()=>F.hiddenModelSelect()),F.addHandlerSelectBtn(e=>{F.hiddenModelSelect(),E(e);let t=o.mealPlanArr.at(-1);F.renderReecipeInMealPlan(t),F.updateCountRecipes(o.mealPlanArr.length),F.disabledBtn(e.btn),O.showPopup(`Added successfully.`)}),F.addHandlerClickOfRecipeInList(()=>F.removeAnySelctedRecipe()),F.addHandlerDeleteBtn(e=>{let t=e.dataset.id,n=e.dataset.dayofweek;F.removeItem(e),F.setAbeldBtnsSelect(n),D(t),o.mealPlanArr.length===0&&F.renderToInitView(),F.updateCountRecipes(o.mealPlanArr.length),O.showPopup(`Successfully removed.`)}),JSON.parse(localStorage.getItem(`mealPlanArr`))&&(o.mealPlanArr=JSON.parse(localStorage.getItem(`mealPlanArr`)),F.renderRecipeInMealPlanFromLocalStortge(o.mealPlanArr),F.updateCountRecipes(o.mealPlanArr.length)),O.addHandlerClosePopup(),M.addHandlerListsBookMarks(),M.handlerCloseList(),N.ListenerOpenModel(),N.closeModelHandler(),w(),o.shoppingListArr.length&&(P.renderItemInShoppingListLocalStortge(o.shoppingListArr),P.updateCount(o.shoppingListArr)),N.addHandlerUpload(K),L();