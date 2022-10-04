const closeFilterBtn = document.querySelector(".close-filter-btn");
const categoriesFilter = document.querySelector(".categories-filter");

closeFilterBtn.addEventListener("click", () => {
  categoriesFilter.classList.add("hidden");
});

categoriesFilter.addEventListener("click", function (e) {
  if (e.target !== this) {
    return;
  }
  categoriesFilter.classList.add("hidden");
});
