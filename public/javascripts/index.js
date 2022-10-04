const htmlTag = document.querySelector("html");
const bodyTag = document.querySelector("body");

htmlTag.classList.remove("m-0", "h-full", "overflow-hidden");
bodyTag.classList.remove("m-0", "h-full", "overflow-hidden");

const closeFilterBtn = document.querySelector(".close-filter-btn");
const categoriesFilter = document.querySelector(".categories-filter");
const openFilterBtn = document.querySelector(".open-filter-btn");

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
