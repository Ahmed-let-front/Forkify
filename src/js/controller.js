import * as model from './model.js';
import view from './Views/View.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import pagination from './Views/Pagination.js';
import bookMark from './Views/bookmark.js';
import addRecipe from './Views/addRecipe.js';
const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    view.renderSpinner(recipeView.parentEl);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
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
  searchView.addHandlerListsResults();
  searchView.unFoucsOnSerchInput();
  pagination.addHandlerPangationNext(controlPangationBtnNext);
  pagination.addHandlerPangationPrev(controlPangationBtnPrev);
  view.renderSkeltonRes(searchView.parentEl);
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
    await controlSearchRes(query);
  } catch (err) {
    searchView.returnToWelcomeView();
    searchView.addHandlerBtnsWelcomeView(controlWelcomeView);
    view.showPopup(err.message, '&times;');
  }
};
const controlWelcomeView = async e => {
  try {
    const query = searchView.getQueryFromClickBtn(e);
    await controlSearchRes(query);
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
    view.showPopup(err.message, '&times;');
    addRecipe.openModel();
  }
};
const controlBookMarkBtn = () => bookMark.toogleBookMarkListShape();
const init = () => {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerRenderSearchRes(controlSearchResults);
  searchView.addHandlerBtnsWelcomeView(controlWelcomeView);
  bookMark.addHandlerBookMark(controlBookMark);
  bookMark.addHandlerBookMarkBtn(controlBookMarkBtn);
  view.addHandlerClosePopup();
  bookMark.addHandlerListsBookMarks();
  bookMark.handlerCloseList();
  addRecipe.ListenerOpenModel();
  addRecipe.closeModelHandler();
  addRecipe.addHandlerUpload(controlAddRecipe);
  controlDataFromLocalStrotge();
};
init();
