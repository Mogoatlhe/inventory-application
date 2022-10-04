const htmlTag = document.querySelector("html");
const bodyTag = document.querySelector("body");
const openFilterBtn = document.querySelector(".open-filter-btn");
const closeFilterBtn = document.querySelector(".close-filter-btn");
const categoriesFilter = document.querySelector(".categories-filter");
const closeSortBtn = document.querySelector(".close-sort-btn");
const itemsSortMenu = document.querySelector(".items-sort");
const openSortBtn = document.querySelector(".open-sort-btn");

const enableScroll = () => {
  htmlTag.classList.remove("m-0", "h-full", "overflow-hidden");
  bodyTag.classList.remove("m-0", "h-full", "overflow-hidden");
};

const preventScroll = () => {
  htmlTag.classList.add("m-0", "h-full", "overflow-hidden");
  bodyTag.classList.add("m-0", "h-full", "overflow-hidden");
};

enableScroll();

const hideCategoriesFilter = () => {
  categoriesFilter.classList.add("hidden");
  enableScroll();
};

const hideItemsSortMenu = () => {
  itemsSortMenu.classList.add("hidden");
  enableScroll();
};

closeFilterBtn.addEventListener("click", () => {
  hideCategoriesFilter();
});

categoriesFilter.addEventListener("click", function (e) {
  if (e.target !== this) {
    return;
  }
  hideCategoriesFilter();
});

openFilterBtn.addEventListener("click", () => {
  categoriesFilter.classList.remove("hidden");
  preventScroll();
});

closeSortBtn.addEventListener("click", () => {
  hideItemsSortMenu();
});

openSortBtn.addEventListener("click", () => {
  itemsSortMenu.classList.remove("hidden");
  preventScroll();
});

itemsSortMenu.addEventListener("click", function (e) {
  if (e.target !== this) {
    return;
  }
  hideItemsSortMenu();
});
