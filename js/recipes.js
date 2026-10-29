import { searchMeal } from "./api.js";
import { toggleFavorite, isMealFavorite } from "./storage.js";

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("search");
let recipesArr = [];
let startingIndex = 0;
let endingIndex = 5;

// ============================ DOM Elements ============================
const result = document.getElementById("result");
const loadMoreBtn = document.getElementById("load-more-btn");
const formContainer = document.getElementById("form-container");
const searchBox = document.getElementById("search-box");
const searchValue = document.getElementById("search-value");
const searchBtn = document.getElementById("search-icon-btn");
const dialogError = document.getElementById("dialog-error");
const tryAgainBtn = document.getElementById("try-again-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const loader = document.querySelector(".loader");
// ============================ DOM Elements ============================

async function fetchRecipes(meal) {
   try {
      const data = await searchMeal(meal);
      if (data === null) { // If data is null, dynamically update the result container with error message
         result.innerHTML = `<p>No recipes found for <em>${query}</em></p>`;
         loadMoreBtn.style.display = "none";
         return;
      }
      recipesArr = data;
      displayRecipes(recipesArr.slice(startingIndex, endingIndex));
   } catch (error) {
      console.log("An error occured:", error);
      dialogError.showModal();
   }
}

async function displaySearchRecipes() {
   const newQuery = query.charAt(0).toUpperCase() + query.slice(1);
   searchValue.textContent = newQuery;

   // Shows the loading animation while awaiting for the API response
   try {
      loader.style.display = "block";
      await fetchRecipes(query);
   } catch (error) {
      console.error("Fetch error:", error);
      dialogError.showModal();
   } finally {
      loader.style.display = "none";
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

function displayRecipes(recipes) {
   recipes.forEach((recipe) => {
      const ingredientsHTML = getIngredients(recipe);
      const instructionsHTML = formatInstructions(recipe.strInstructions);

      const isFav = isMealFavorite(recipe.idMeal);

      result.innerHTML += `
         <div class="recipe-container" id="${recipe.idMeal}">
            <div class="meal-image-container">
               <img loading="lazy" src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="meal-image" />
            </div>
            <div class="meal-info-container">
               <button type="button" class="fav-btn ${isFav ? "filled" : ""}" data-id="${recipe.idMeal}" title="${isFav ? "Remove from your favorites" : "Add to your Favorites"}">
                  ${isFav ? "&#10084;" : "&#9825;"}
               </button>
               <h2 class="meal-title">${recipe.strMeal}</h2>
               <h3>Ingredients</h3>
               <ul class="ingredient-list">
                  ${ingredientsHTML}
               </ul>
               <h3>Instructions</h3>
               <ol class="instruction-steps">
                  ${instructionsHTML}
               </ol>
               <h4>Source</h4>
               <a href="${recipe.strSource === null || recipe.strSource === "" ? "" : recipe.strSource}" target="_blank" class="meal-source">${recipe.strSource === null || recipe.strSource === "" ? "Not Available" : recipe.strSource}</a>
            </div>
         </div>
      `
   });
}

// To add 5 more additional results if available.
function displayMoreRecipes() {
   if (startingIndex + 5 >= recipesArr.length) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.cursor = "not-allowed";
      loadMoreBtn.textContent = "No more data to load";
   }

   startingIndex += 5;
   endingIndex += 5;
   displayRecipes(recipesArr.slice(startingIndex, endingIndex));

   if (recipesArr.length <= endingIndex) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.cursor = "not-allowed";
      loadMoreBtn.textContent = "No more data to load";
   }
}

async function searchRecipes() {
   result.innerHTML = "";
   const searchQuery = searchBox.value.trim()
   const newQuery = searchBox.value.trim().charAt(0).toUpperCase() + searchBox.value.trim().slice(1);
   
   // Reloads the same page when searching with a ""/null value in the searchbox
   if (!searchQuery) {
      displaySearchRecipes();
      return;
   }
   
   // Updates the URL search=value when searching directly in recipes.html
   window.location.href = `recipes.html?search=${encodeURIComponent(searchQuery)}`;

   try {
      await fetchRecipes(searchQuery);
      searchValue.textContent = newQuery;
   } catch (error) {
      console.error("Fetch error:", error);
      dialogError.showModal();
   }

}

// ============================ DOM Events ============================
result.addEventListener("click", function(e) { // Add or Remove favorite meal
   const favBtn = e.target.closest(".fav-btn"); // -> Event Delegation

   if (!favBtn) return;

   const mealId = favBtn.getAttribute("data-id");

   // Pushes the idMeal to the localStorage
   toggleFavorite(mealId);

   // Check if idMeal already exist in localStorage and send the result to the UI
   const isNowFav = isMealFavorite(mealId);

   // Updates the UI of the heart button
   if (isNowFav) {
      favBtn.classList.add("filled");
      favBtn.innerHTML = "&#10084;";
      favBtn.title = "Remove from your favorites";
   } else {
      favBtn.classList.remove("filled");
      favBtn.innerHTML = "&#9825;";
      favBtn.title = "Add to your Favorites";
   }
})

loadMoreBtn.addEventListener("click", displayMoreRecipes);

formContainer.addEventListener("submit", function(e) {
   e.preventDefault();
   searchRecipes();
})

searchBtn.addEventListener("click", function(e) {
   e.preventDefault();
   searchRecipes();
})

tryAgainBtn.addEventListener("click", function() {
   searchRecipes();
   dialogError.close();
})

closeModalBtn.addEventListener("click", function() {
   dialogError.close();
})

// ============================ DOM Events ============================

// To display the result in the DOM.
displaySearchRecipes();