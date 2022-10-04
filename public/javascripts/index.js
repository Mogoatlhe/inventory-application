const htmlTag = document.querySelector("html");
const bodyTag = document.querySelector("body");

htmlTag.classList.remove("m-0", "h-full", "overflow-hidden");
bodyTag.classList.remove("m-0", "h-full", "overflow-hidden");

const closeFilterBtn = document.querySelector(".close-filter-btn");
const categoriesFilter = document.querySelector(".categories-filter");
const openFilterBtn = document.querySelector(".open-filter-btn");

closeFilterBtn.addEventListener("click", () => {
  categoriesFilter.classList.add("hidden");
});

categoriesFilter.addEventListener("click", function (e) {
  if (e.target !== this) {
    return;
  }
  categoriesFilter.classList.add("hidden");
});

openFilterBtn.addEventListener("click", () => {
  categoriesFilter.classList.remove("hidden");
  htmlTag.classList.add("m-[0]", "h-full", "overflow-hidden");
  bodyTag.classList.add("m-[0]", "h-full", "overflow-hidden");
});
