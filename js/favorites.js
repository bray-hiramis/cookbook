import { searchMealById } from "./api.js";
import { getFavorites, toggleFavorite } from "./storage.js";

// ============================ DOM Elements ============================
const categoryFilter = document.getElementById("category-filter");
const recipeContainer = document.getElementById("recipes-container");
// ======================================================================

async function fetchFavoriteRecipes() { // fetching API and Local Storage

   const favoriteMealIds = getFavorites(); // array of saved meal IDs

   if (favoriteMealIds.length === 0) {
      recipeContainer.innerHTML = `<p>No favorite recipes saved yet.</p>`;
      return;
   }
   
   try {
      const fetchPromise = favoriteMealIds.map(id => searchMealById(id)); // api call
      const result = await Promise.all(fetchPromise); // array of promises
      const favoriteRecipes = result.map(data => data ? data[0] : null).filter(Boolean); // parsed promises
      displayMeal(favoriteRecipes); // displaying to DOM
   } catch (error) {
      console.error("Error fetching favorite recipes:", error);
   }
}

function displayMeal(recipes) {
   recipeContainer.innerHTML = "";

   recipes.forEach(meal => {
      recipeContainer.innerHTML += `
         <div class="recipe-box" data-category="${meal.strCategory}">
            <button type="button" class="delete-fav" data-id="${meal.idMeal}" title="Delete favorite meal">
               <i class="fa-solid fa-trash-can"></i>
            </button>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" class="meal-img">
            <p class="meal-name">${meal.strMeal}</p>
            <button type="button" class="view-details">View Details</button>
         </div>
      `
   });
}

categoryFilter.addEventListener("change", function(e) {
   const selectedCategory = e.target.value;
   const recipeCards = document.querySelectorAll(".recipe-box");
   const emptyMsg = recipeContainer.querySelector(".empty-filter-message");

   let matchCount = 0;

   recipeCards.forEach(card => {
      const cardCategory = card.dataset.category;

      if (selectedCategory === "All" || cardCategory === selectedCategory) {
         card.style.display = "flex";
         matchCount++;
      } else {
         card.style.display = "none";
      }
   });

   if (matchCount === 0) {
      // If no cards match, show a message if it doesn't already exist
      if (!emptyMsg) {
         recipeContainer.insertAdjacentHTML(
            "beforeend", 
            `<p class="empty-filter-message" style="grid-column: 1 / -1; text-align: center;">No favorite recipes found in this category.</p>`
         );
      }
   } else {
      // If cards match, remove the empty message if it exists
      if (emptyMsg) {
         emptyMsg.remove();
      }
   }
   
})

recipeContainer.addEventListener("click", function(e) {
   const deleteBtn = e.target.closest(".delete-fav");

   if (!deleteBtn) return;

   const mealId = deleteBtn.getAttribute("data-id");

   toggleFavorite(mealId); // Remove the favorite meal to the localstorage

   // Immediately deletes the DOM element
   const recipeBox = deleteBtn.closest(".recipe-box")
   recipeBox.remove();

   // If localstorage has no saved meal IDs
   if (getFavorites().length === 0) {
      recipeContainer.innerHTML = `<p>No favorite recipes saved yet.</p>`;
   }

})

// Displaing favorite meals in the DOM
fetchFavoriteRecipes();