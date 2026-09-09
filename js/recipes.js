import { searchMeal } from "./api.js";
import { getFavorites, toggleFavorite, isMealFavorite } from "./storage.js";

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("search");
let recipesArr = [];
let startingIndex = 0;
let endingIndex = 5;

const result = document.getElementById("result");
const loadMoreBtn = document.getElementById("load-more-btn");

async function fetchRecipes() {
   if (query) {
      try {
         const data = await searchMeal(query);
         recipesArr = data;
         displayRecipes(recipesArr.slice(startingIndex, endingIndex));
         return recipesArr;
      } catch (error) {
         console.log("An error occured:", error);
      }
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

function displayMoreRecipes() {
   startingIndex += 5;
   endingIndex += 5;

   displayRecipes(recipesArr.slice(startingIndex, endingIndex));
   if (recipesArr.length <= endingIndex) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.cursor = "not-allowed";
      loadMoreBtn.textContent = "No more data to load";
   }
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
               <ull class="ingredient-list">
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

   const favBtn = document.querySelectorAll(".fav-btn");

   favBtn.forEach(fav => {
      fav.addEventListener("click", function() {
         const mealId = fav.getAttribute("data-id");

         // Pushes the idMeal to the localStorage
         toggleFavorite(mealId);

         // Check if idMeal already exist in localStorage and send the result to the UI
         const isNowFav = isMealFavorite(mealId);

         // Updates the UI of the heart button
         if (isNowFav) {
            fav.classList.add("filled");
            fav.innerHTML = "&#10084;";
            fav.title = "Remove from your favorites";
         } else {
            fav.classList.remove("filled");
            fav.innerHTML = "&#9825;";
            fav.title = "Add to your Favorites";
         }
      })
   })

}

loadMoreBtn.addEventListener("click", displayMoreRecipes);

// For testing purposes only to check the fetch output in console
const testFetch = fetchRecipes()
console.log(testFetch);