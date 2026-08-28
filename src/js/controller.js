import * as model from './model.js';
import view from './Views/View.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import pagination from './Views/Pagination.js';
import bookMark from './Views/bookmark.js';
import addRecipe from './Views/addRecipe.js';
import shoppingList from './Views/shoppingList.js';
import mealPlan from './Views/mealPlan.js';
const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    view.renderSpinner(recipeView.parentEl);
    await model.loadRecipe(id);
    await model.loadRecipeCalories();
    recipeView.render(model.state.recipe);
    shoppingList.addHandlerAddIngredient(controlAddShoppingList);
    recipeView.addHandlerUpdateIngBtn(controlServings);
    bookMark.toogleRenderBookmark(model.state.recipe);
  } catch (err) {
    recipeView.renderInitContent();
    view.showPopup(err.message, '&times;');
  }
};
const controlDataFromLocalStrotge = () => {
  model.getDataFromLocalStrotgeBookMark();
  bookMark.updateUiBookMarkCount(model.state.bookmarks.countBooMarks);
  if (model.state.bookmarks.bookmarksArr.length === 0) return;
  bookMark.renderRecipesFromLocalStortge(model.state.bookmarks.bookmarksArr);
  const id = window.location.hash.slice(1);
  bookMark.autoSelctedAfterReload(id);
};
const controlSearchRes = async query => {
  searchView.injectionMarkupListContainer();
  view.renderSkeltonRes(searchView.parentEl);
  searchView.addHandlerListsResults();
  searchView.unFoucsOnSerchInput();
  pagination.addHandlerPangationNext(controlPangationBtnNext);
  pagination.addHandlerPangationPrev(controlPangationBtnPrev);
  searchView.renderResContainerList(await model.loadSearchResData(query));
  searchView.renderPageNum(
    model.state.search.currPage,
    model.state.search.maxItmes,
  );
  searchView.renderPageCount(model.state.search.maxItmes);
  if (model.isDataOfResVaild()) return;
  view.showContainerBtnsPagination();
};
const controlSearchResults = async query => {
  try {
    if (query === '') return;
    searchView.hiddenSortSelect();
    await controlSearchRes(query);
    searchView.showSortSelect();
  } catch (err) {
    searchView.returnToWelcomeView();
    searchView.addHandlerBtnsWelcomeView(controlWelcomeView);
    view.showPopup(err.message, '&times;');
  }
};
const controlWelcomeView = async e => {
  try {
    const query = searchView.getQueryFromClickBtn(e);
    searchView.hiddenSortSelect();
    await controlSearchRes(query);
    searchView.showSortSelect();
  } catch (err) {
    searchView.returnToWelcomeView();
    searchView.addHandlerBtnsWelcomeView(controlWelcomeView);
    view.showPopup(err.message, '&times;');
  }
};
const controlPangationBtnNext = () => {
  view.renderSkeltonRes(pagination.parentEl);
  const res = model.paginationLoadResNext();
  searchView.renderResContainerList(res);
  searchView.renderPageNum(
    model.state.search.currPage,
    model.state.search.maxItmes,
  );
};
const controlPangationBtnPrev = () => {
  view.renderSkeltonRes(pagination.parentEl);
  const res = model.paginationLoadResPrev();
  searchView.renderResContainerList(res);
  searchView.renderPageNum(
    model.state.search.currPage,
    model.state.search.maxItmes,
  );
};
const controlServings = updateTo => {
  model.updateServings(updateTo);
  recipeView.renderNewIng(
    model.state.recipe.ingredients,
    model.state.recipe.servings,
  );
};
const controlRemoveBookMark = () => {
  model.removeBookMark(model.state.recipe);
  bookMark.updateUiBookMarkCount(model.state.bookmarks.countBooMarks);
  bookMark.removeBookmark(model.state.recipe);
  bookMark.toogleRenderBookmark(model.state.recipe);
};
const controlBookMark = () => {
  if (model.state.recipe.bookMarked) {
    controlRemoveBookMark();
    return;
  }
  model.addBookMark(model.state.recipe);
  bookMark.renderRecipes(model.state.bookmarks.bookmarksArr);
  bookMark.updateUiBookMarkCount(model.state.bookmarks.countBooMarks);
  bookMark.toogleRenderBookmark(model.state.recipe);
};
const controlAddRecipe = async data => {
  try {
    addRecipe.closeModel();
    view.renderSpinner(recipeView.parentEl);
    await model.uploadRecipe(data);
    recipeView.render(model.state.recipe);
    bookMark.toogleRenderBookmark(model.state.recipe);
    bookMark.updateUiBookMarkCount(model.state.bookmarks.countBooMarks);
    bookMark.renderRecipes(model.state.bookmarks.bookmarksArr);
    window.history.pushState(
      null,
      '',
      `#${model.state.recipe.id ? model.state.recipe.id : ''}`,
    );
  } catch (err) {
    recipeView.renderInitContent();
    view.showPopup(err.message, '&times;');
    addRecipe.openModel();
  }
};
const controlSortSelect = async e => {
  try {
    searchView.renderResContainerList(await model.sortBy(e));
  } catch (err) {
    view.showPopup(err.message, '&times;');
  }
};
const controlAddIngredient = () => {
  addRecipe.appendMarkupInputBtn();
  view.showPopup('One has been added.');
};
const controlBookMarkBtn = () => bookMark.toogleBookMarkListShape();
const controlShowShoppingContainer = () => shoppingList.showShoppingContanier();
const controlHiddenShoppingContainer = () =>
  shoppingList.hiddenShoppingContanier();
const controlAddShoppingList = () => {
  try {
    model.addShoppingList();
    shoppingList.renderItemInShoppingList(model.state.shoppingListArr);
    shoppingList.updateCount(model.state.shoppingListArr);
    view.showPopup('Done. Take a look at the shopping List.');
  } catch (err) {
    view.showPopup(err.message, '&times;');
  }
};
const controlAddShoppingListLocalStortge = () => {
  model.setShoppingArrFromLocalStortge();
  if (!model.state.shoppingListArr.length) return;
  shoppingList.renderItemInShoppingListLocalStortge(
    model.state.shoppingListArr,
  );
  shoppingList.updateCount(model.state.shoppingListArr);
};
const controlRemoveShoppingList = id => {
  model.removeShoppingList(id);
  shoppingList.removeItem(id);
  shoppingList.updateCount(model.state.shoppingListArr);
  view.showPopup('Successfully removed.');
  if (model.state.shoppingListArr.length === 0) shoppingList.renderToInitView();
};
const conrolShowMealPlanModel = () => {
  mealPlan.showModel();
};
const controlHiddenMealPlanModel = () => mealPlan.hiddenModel();
const controlHiddenMealPlanSelect = () => mealPlan.hiddenModelSelect();
const controlShowMealPlanSelect = () => {
  if (model.state.mealPlanArr.some(el => el.id === model.state.recipe.id)) {
    view.showPopup('It was added previously', '&times;');
    return;
  }
  mealPlan.showModelSelect();
};
const controlAddToMealPlan = data => {
  mealPlan.hiddenModelSelect();
  model.addRecipeToMealPlan(data);
  const lastEl = model.state.mealPlanArr.at(-1);
  mealPlan.renderReecipeInMealPlan(lastEl);
  mealPlan.updateCountRecipes(model.state.mealPlanArr.length);
  mealPlan.disabledBtn(data.btn);
  view.showPopup('Added successfully.');
};
const controlRenderMealLocalStortge = () => {
  if (!JSON.parse(localStorage.getItem('mealPlanArr'))) return;
  model.state.mealPlanArr = JSON.parse(localStorage.getItem('mealPlanArr'));
  mealPlan.renderRecipeInMealPlanFromLocalStortge(model.state.mealPlanArr);
  mealPlan.updateCountRecipes(model.state.mealPlanArr.length);
};
const controlDeleteItemMealPlan = parentEl => {
  const id = parentEl.dataset.id;
  mealPlan.removeItem(parentEl);
  mealPlan.setabledAbilityBtnsSelect(model.state.mealPlanArr, "abeld");
  model.removeItemFromArr(id);
  if (model.state.mealPlanArr.length === 0) mealPlan.renderToInitView();
  mealPlan.updateCountRecipes(model.state.mealPlanArr.length);
  view.showPopup('Successfully removed.');
};
const controlClickInRecipeInList = () => mealPlan.removeAnySelctedRecipe();
const init = () => {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerRenderSearchRes(controlSearchResults);
  searchView.addHandlerBtnsWelcomeView(controlWelcomeView);
  bookMark.addHandlerBookMark(controlBookMark);
  bookMark.addHandlerBookMarkBtn(controlBookMarkBtn);
  searchView.addHandlerSortSelect(controlSortSelect);
  addRecipe.addHandlerAddInputIngredient(controlAddIngredient);
  shoppingList.addHandlerShoppingBtnShow(controlShowShoppingContainer);
  shoppingList.addHandlerShoppingBtnClose(controlHiddenShoppingContainer);
  shoppingList.addHandlerRemoveIngredient(controlRemoveShoppingList);
  mealPlan.addHandlerShowBtnModel(conrolShowMealPlanModel);
  mealPlan.addHandlerHiddenBtnModel(controlHiddenMealPlanModel);
  mealPlan.addHandlerBtnAdd(controlShowMealPlanSelect);
  mealPlan.addHandlerHiddenBtnModelSelect(controlHiddenMealPlanSelect);
  mealPlan.addHandlerSelectBtn(controlAddToMealPlan);
  mealPlan.addHandlerClickOfRecipeInList(controlClickInRecipeInList);
  mealPlan.addHandlerDeleteBtn(controlDeleteItemMealPlan);
  controlRenderMealLocalStortge();
  view.addHandlerClosePopup();
  bookMark.addHandlerListsBookMarks();
  bookMark.handlerCloseList();
  addRecipe.ListenerOpenModel();
  addRecipe.closeModelHandler();
  controlAddShoppingListLocalStortge();
  addRecipe.addHandlerUpload(controlAddRecipe);
  controlDataFromLocalStrotge();
};
init();
