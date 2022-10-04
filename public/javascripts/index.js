const htmlTag = document.querySelector("html");
const bodyTag = document.querySelector("body");

htmlTag.classList.remove("m-0", "h-full", "overflow-hidden");
bodyTag.classList.remove("m-0", "h-full", "overflow-hidden");

const openFilterBtn = document.querySelector(".open-filter-btn");
const closeFilterBtn = document.querySelector(".close-filter-btn");
const categoriesFilter = document.querySelector(".categories-filter");
const closeSortBtn = document.querySelector(".close-sort-btn");
const itemsSort = document.querySelector(".items-sort");
const openSortBtn = document.querySelector(".open-sort-btn");

const hideCategoriesFilter = () => {
  categoriesFilter.classList.add("hidden");
  htmlTag.classList.remove("m-0", "h-full", "overflow-hidden");
  bodyTag.classList.remove("m-0", "h-full", "overflow-hidden");
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
  htmlTag.classList.add("m-0", "h-full", "overflow-hidden");
  bodyTag.classList.add("m-0", "h-full", "overflow-hidden");
});

closeSortBtn.addEventListener("click", () => {
  itemsSort.classList.add("hidden");
});

openSortBtn.addEventListener("click", () => {
  itemsSort.classList.remove("hidden");
});

itemsSort.addEventListener("click", function (e) {
  if (e.target !== this) {
    return;
  }
  itemsSort.classList.add("hidden");
});
