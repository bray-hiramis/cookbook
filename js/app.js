const formContainer = document.getElementById("form-container");
const searchIconBtn = document.getElementById("search-icon-btn");
const searchBox = document.getElementById("search-box");

function getSearchEntry() {
   const searchQuery = searchBox.value.trim();
   if (searchQuery) {
      window.location.href = `recipes.html?search=${encodeURIComponent(searchQuery)}`;
   }
}

formContainer.addEventListener("submit", function(e) {
   e.preventDefault();
   getSearchEntry();
})

searchIconBtn.addEventListener("click", function(e) {
   e.preventDefault();
   getSearchEntry();
})