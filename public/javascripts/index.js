const htmlTag = document.querySelector("html");
const bodyTag = document.querySelector("body");
const openFilterBtn = document.querySelector(".open-filter-btn");
const closeFilterBtn = document.querySelector(".close-filter-btn");
const categoriesFilter = document.querySelector(".categories-filter");
const closeSortBtn = document.querySelector(".close-sort-btn");
const itemsSortMenu = document.querySelector(".items-sort");
const openSortBtn = document.querySelector(".open-sort-btn");
const categoryForm = document.querySelector("#category-form");
const toggleCategoryForm = document.querySelector("#toggle-category-form");
const dcirclePlus = "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z";
const dcircleMinus = "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z";

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
  if (toggleCategoryForm.classList.contains("categories-form-visible")) {
    toggleCategoryForm.click();
  }
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

const sortTypeSelect = document.querySelector("#sort-type-select");
const sortTypes = document.querySelectorAll(".sort-type p");

for (const sortType of sortTypes) {
  const circle = sortType.previousSibling;

  circle.classList.remove("border-green-300");
  if (sortType.textContent === sortTypeSelect.value) {
    circle.classList.add("border-green-300");
  }

  sortType.addEventListener("click", () => {
    sortTypeSelect.value = sortType.textContent;
    sortTypeSelect.dispatchEvent(new Event("change"));
  });
}

const path = toggleCategoryForm.firstChild.firstChild;
toggleCategoryForm.addEventListener("click", () => {
  if (categoryForm.classList.contains("hidden")) {
    categoryForm.classList.remove("hidden");
    toggleCategoryForm.classList.add("categories-form-visible");
    path.setAttribute("d", dcircleMinus);
  } else {
    categoryForm.classList.add("hidden");
    toggleCategoryForm.classList.remove("categories-form-visible");
    path.setAttribute("d", dcirclePlus);
  }
});

const editCategoryBtns = document.querySelectorAll(".edit-category-btn");

for (const editCategoryBtn of editCategoryBtns) {
  editCategoryBtn.addEventListener("click", function () {});
}
