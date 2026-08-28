import {
  DECIMAL_BASE,
  API_URL,
  RES_PER_PAGE,
  KEY,
  USDA_API_URL,
  USDA_KEY,
} from './config.js';
import { AJAX } from './helpers.js';

/**
 * @typedef {Object} Ingredient
 * @property {number|null} quantity - Amount, or null when unspecified.
 * @property {string} unit
 * @property {string} description
 */

/**
 * @typedef {Object} Recipe
 * @property {string} id
 * @property {string} title
 * @property {string} publisher
 * @property {string} sourceUrl
 * @property {string} image
 * @property {number} servings
 * @property {number} cookingTime
 * @property {Ingredient[]} ingredients
 * @property {string} [key] - Present only for user-uploaded recipes.
 * @property {boolean} [bookMarked] - Set by loadRecipe.
 */

/**
 * @typedef {Object} RecipeSummary
 * @property {string} id
 * @property {string} title
 * @property {string} publisher
 * @property {string} image_url
 * @property {string} [key] - Present only for user-uploaded recipes.
 */

/**
 * @typedef {Object} SearchState
 * @property {string} query
 * @property {RecipeSummary[]} results
 * @property {number} currPage
 * @property {() => number} maxItmes
 */

/**
 * @typedef {Object} BookmarksState
 * @property {number} countBooMarks
 * @property {Recipe[]} bookmarksArr
 */

/**
 * @typedef {Object} State
 * @property {Recipe} recipe
 * @property {SearchState} search
 * @property {BookmarksState} bookmarks
 */

/** @type {State} */
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    currPage: 1,
    get maxItmes() {
      return Math.ceil(this.results.length / RES_PER_PAGE);
    },
  },
  bookmarks: {
    countBooMarks: 0,
    bookmarksArr: [],
  },
  shoppingListArr: [],
  mealPlanArr: [],
};
let countReicpes = 7;
/**
 * Normalizes the Forkify API payload into the Recipe shape used across views.
 * @param {Object} data - Forkify API response payload.
 * @returns {Recipe}
 */
const createRecipeObject = data => {
  const recipe = data?.data?.recipe || data.data.recipes;
  return {
    id: recipe?.id || '',
    title: recipe?.title || '',
    publisher: recipe?.publisher || '',
    sourceUrl: recipe?.source_url || '',
    image: recipe?.image_url || '',
    servings: recipe?.servings || 1,
    cookingTime: recipe?.cooking_time || 0,
    ingredients: recipe?.ingredients || [],
    ...(recipe?.key && { key: recipe.key }),
  };
};
/**
 * Loads a recipe by id and flags it as bookmarked when it already exists in
 * the bookmark list, so the UI renders the correct icon state.
 * @param {string} id
 */
export const loadRecipe = async id => {
  const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
  state.recipe = createRecipeObject(data);
  if (state.bookmarks.bookmarksArr?.some(b => b.id === id))
    state.recipe.bookMarked = true;
  else state.recipe.bookMarked = false;
};
/**
 * Converts a decimal fraction into a simplified "numerator/denominator" string.
 * Whole numbers pass through unchanged; the GCD reduction keeps the result
 * human-readable (e.g. 0.5 → "1/2", not "5/10").
 * @param {number} decimal
 * @returns {string}
 */
export const converDecimalToFraction = decimal => {
  if (decimal >= 1) return decimal;
  const denominator = DECIMAL_BASE ** decimal.toString().split('.')[1].length;
  const numerator = decimal * denominator;
  const getGCD = (a, b) => (b === 0 ? a : getGCD(b, a % b));
  const gcd = getGCD(denominator, numerator);
  return `${numerator / gcd}/${denominator / gcd}`;
};
export const getPageData = (page = state.search.currPage, dataType) => {
  state.search.currPage = page;
  let start = (page - 1) * RES_PER_PAGE;
  let end = page * RES_PER_PAGE;
  if (dataType === 'detailed')
    return state.search.detailedResults.slice(start, end);
  else return state.search.results.slice(start, end);
};
/**
 * @param {string} query
 * @returns {Promise<RecipeSummary[]>}
 */
export const loadSearchResData = async query => {
  state.search.query = query;
  const data = await AJAX(`${API_URL}?search=${state.search.query}&key=${KEY}`);
  state.search.results = data.data.recipes;
  state.search.currPage = 1;
  return getPageData();
};
export const isDataOfResVaild = () =>
  state.search.results.length <= RES_PER_PAGE;
export const paginationLoadResNext = () => {
  if (state.search.currPage === state.search.maxItmes)
    state.search.currPage = 0;
  return getPageData(++state.search.currPage);
};
export const paginationLoadResPrev = () => {
  if (state.search.currPage === 1)
    state.search.currPage = state.search.maxItmes + 1;
  return getPageData(--state.search.currPage);
};
/**
 * @param {number} newServings
 */
export const updateServings = function (newServings) {
  if (newServings === 0) return;
  state.recipe.ingredients.forEach(ing => {
    if (ing.quantity) {
      ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    }
  });
  state.recipe.servings = newServings;
};
export const updateCountBookMark = () => {
  state.bookmarks.countBooMarks = state.bookmarks.bookmarksArr.length;
};
/**
 * Persists the bookmark list to localStorage after every change so a page
 * reload can restore it.
 * @param {Recipe} recipe
 */
export const addBookMark = recipe => {
  state.bookmarks.bookmarksArr.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;
  updateCountBookMark();
  const dataForLocalStortge = {
    bookMarksArr: state.bookmarks.bookmarksArr,
    countBookMarks: state.bookmarks.countBooMarks,
  };
  localStorage.setItem('bookMarkState', JSON.stringify(dataForLocalStortge));
};
/**
 * @param {Recipe} recipe
 */
export const removeBookMark = recipe => {
  if (state.bookmarks.bookmarksArr?.some(b => b.id === recipe.id))
    state.recipe.bookMarked = false;
  state.bookmarks.bookmarksArr = state.bookmarks.bookmarksArr.filter(
    rec => rec.id !== recipe.id,
  );
  updateCountBookMark();
  const dataForLocalStortge = {
    bookMarksArr: state.bookmarks.bookmarksArr,
    countBookMarks: state.bookmarks.countBooMarks,
  };
  localStorage.setItem('bookMarkState', JSON.stringify(dataForLocalStortge));
};
/**
 * Restores persisted bookmarks from localStorage on startup; safely no-ops
 * when nothing was stored yet.
 */
export const getDataFromLocalStrotgeBookMark = () => {
  const data = JSON.parse(localStorage.getItem('bookMarkState'));
  if (!data) return;
  const { bookMarksArr, countBookMarks } = data;
  state.bookmarks.bookmarksArr = bookMarksArr;
  state.bookmarks.countBooMarks = countBookMarks;
};
/**
 * Parses every "quantity,unit,description" ingredient field from the uploaded
 * form and rejects the whole upload when any field is missing a part, since
 * the API requires all three parts of each ingredient.
 * @param {Object} data - Raw form data from the add-recipe view.
 * @returns {Promise<void>}
 */
export const uploadRecipe = async data => {
  const ingredients = Object.entries(data)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArr = ing[1].split(',').map(el => el.trim());
      if (ingArr.length !== 3) throw new Error('Wrong Ingredient Format');
      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });
  const recipe = {
    title: data.title,
    source_url: data.sourceUrl,
    image_url: data.image,
    publisher: data.publisher,
    cooking_time: +data.cookingTime,
    servings: +data.servings,
    ingredients,
  };
  const dataNewRecipe = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe = createRecipeObject(dataNewRecipe);
  addBookMark(state.recipe);
};
export const sortBy = async e => {
  if (
    !state.search.detailedResults?.some(
      el => el.id === state.search.results[0].id,
    )
  ) {
    const IDS = state.search.results.map(el => el.id);
    state.search.detailedResults = await Promise.all(
      IDS.map(id => AJAX(`${API_URL}/${id}?key=${KEY}`)),
    );
    state.search.detailedResults = state.search.detailedResults.map(
      el => el.data.recipe,
    );
  }
  if (e.target.value === 'duration') {
    state.search.detailedResults.sort(
      (a, b) => b.cooking_time - a.cooking_time,
    );
  } else
    state.search.detailedResults.sort(
      (a, b) => b.ingredients.length - a.ingredients.length,
    );
  return getPageData(state.search.currPage, 'detailed');
};
export const addShoppingList = () => {
  if (state.shoppingListArr?.some(rec => rec.id === state.recipe.id))
    throw Error('This was added previously.');
  state.shoppingListArr.push(state.recipe);
  localStorage.setItem(
    'shoppingListArr',
    JSON.stringify(state.shoppingListArr),
  );
};
export const removeShoppingList = id => {
  state.shoppingListArr = state.shoppingListArr.filter(el => el.id !== id);
  localStorage.setItem(
    'shoppingListArr',
    JSON.stringify(state.shoppingListArr),
  );
};
export const setShoppingArrFromLocalStortge = () => {
  state.shoppingListArr =
    JSON.parse(localStorage.getItem('shoppingListArr')) || [];
};
export const loadRecipeCalories = async () => {
  const queryTitle = state.recipe.title.split(' ').slice(0, 2).join(' ');
  const searchData = await AJAX(
    `${USDA_API_URL}/foods/search?query=${encodeURIComponent(queryTitle)}&api_Key=${USDA_KEY}`,
  );
  const foodId = searchData.foods[0].fdcId;
  const foodData = await AJAX(
    `${USDA_API_URL}/food/${foodId}?api_Key=${USDA_KEY}`,
  );
  const caloriesNutrient = foodData.foodNutrients.find(
    n =>
      n.nutrient?.number === '208' ||
      n.nutrient?.number === '1008' ||
      n.nutrient?.name?.toLowerCase().includes('energy'),
  );
  state.recipe.calories = caloriesNutrient
    ? Math.round(caloriesNutrient.amount)
    : 'N/A';
};
export const addRecipeToMealPlan = data => {
  const { day, dayOfWeak } = data;
  const dataOfRecipe = { ...state.recipe, day, dayOfWeak };
  state.mealPlanArr.push(dataOfRecipe);
  localStorage.setItem('mealPlanArr', JSON.stringify(state.mealPlanArr));
};
export const removeItemFromArr = id => {
  state.mealPlanArr = state.mealPlanArr.filter(el => el.id !== id);
  localStorage.setItem('mealPlanArr', JSON.stringify(state.mealPlanArr));
};
