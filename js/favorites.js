import { searchMealById } from "./api.js";
import { getFavorites } from "./storage.js";

const categoryFilter = document.getElementById("category-filter");
const recipeContainer = document.getElementById("recipes-container");

const favoriteMealIds = getFavorites(); // array of saved meal IDs

async function fetchFavoriteRecipes() {
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

   recipeCards.forEach(card => {
      const cardCategory = card.dataset.category;

      if (selectedCategory === "All" || cardCategory === selectedCategory) {
         card.style.display = "flex";
      } else {
         card.style.display = "none";
      }
   })
})

fetchFavoriteRecipes();