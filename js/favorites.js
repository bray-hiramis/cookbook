import { searchMealById } from "./api.js";
import { getFavorites, toggleFavorite } from "./storage.js";

// ============================ DOM Elements ============================
const categoryFilter = document.getElementById("category-filter");
const recipeContainer = document.getElementById("recipes-container");
const lightBoxContainer = document.getElementById("lightbox-container");
const lightbox = lightBoxContainer.querySelector(".lightbox");
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
            <button type="button" class="view-details" data-id="${meal.idMeal}">View Details</button>
         </div>
      `
   });
}

async function fetchMealById(mealId) {

   try {
      const data = await searchMealById(mealId);
      displayMealLightBox(data[0]);
   } catch (error) {
      console.error("Error fetching favorite recipes:", error);
   }
   
}

function getIngredients(recipe) {
   let listRecipe = "";
   for (let i = 0; i <= 20; i++) {

      // Bracket Notation recipe[strIngredient${i}]: Allows you to dynamically access object keys like strIngredient1, strIngredient2, etc., using a loop variable i.
      const measurement = recipe[`strMeasure${i}`];
      const ingredient = recipe[`strIngredient${i}`];
      const measurementAndIngredient = `${measurement} ${ingredient}`;

      if (ingredient && ingredient.trim() !== "") {
         listRecipe += `<li class="ingredient-item">${measurementAndIngredient}</li>`;
      }
   }
   return listRecipe;
}

function formatInstructions(instructions) {
   if (!instructions) return "";
   const steps = instructions
      .split(/\r?\n/)
      .map(step => step.trim())
      .filter(step => step.length > 0);
   return steps.map(step => `<li>${step}</li>`).join("");
}

function displayMealLightBox(recipe) {
   const ingredientsHTML = getIngredients(recipe);
   const instructionsHTML = formatInstructions(recipe.strInstructions);

   lightbox.innerHTML = "";

   lightbox.innerHTML += `
      <button type="button" class="close-lightbox" title="Close">X</button>
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy" class="meal-img-lightbox">
      <h2>${recipe.strMeal}</h2>
      <p>Ingredients:</p>
      <br>
      <ul class="ingredients-list-lightbox">
         ${ingredientsHTML}
      </ul>
      <br>
      <p>Instructions:</p>
      <br>
      <ol class="instruction-steps-lightbox">
         ${instructionsHTML}
      </ol>
      <br>
      <p>Source</p>
      <a href="${recipe.strSource === null || recipe.strSource === "" ? "" : recipe.strSource}" target="_blank" class="meal-source-lightbox">${recipe.strSource === null || recipe.strSource === "" ? "Not Available" : recipe.strSource}</a>
   `
}

// ============================ Event Listener ============================
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

   /* Delete logic */
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

recipeContainer.addEventListener("click", function(e) {
   const viewDetails = e.target.closest(".view-details");

   if (!viewDetails) return;

   const mealId = viewDetails.getAttribute("data-id");
   fetchMealById(mealId);
   lightBoxContainer.style.display = "flex";
})

lightBoxContainer.addEventListener("click", function(e) { // closing lightbox viewer
   const closeLightBox = e.target.closest(".close-lightbox");
   if (e.target === lightBoxContainer || closeLightBox) {
      lightbox.innerHTML = "";
      lightBoxContainer.style.display = "none";
      return;
   }
})

document.addEventListener("keydown", function(e) { // closing lightbox viewer
   if (e.key === "Escape") {
      lightbox.innerHTML = "";
      lightBoxContainer.style.display = "none";
      return;
   }
})

// ======================================================================

// Displaing favorite meals in the DOM
fetchFavoriteRecipes();