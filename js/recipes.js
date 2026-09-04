import { searchMeal } from "./api.js";

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("search");
let recipesArr = [];
let startingIndex = 0;
let endingIndex = 5;

const result = document.getElementById("result");

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
      /*
         Bracket Notation recipe[strIngredient${i}]: Allows you to dynamically access object keys like strIngredient1, strIngredient2, etc., using a loop variable i.
      */
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
   result.innerHTML = "";
   
   recipes.forEach((recipe) => {
      const ingredientsHTML = getIngredients(recipe);
      const instructionsHTML = formatInstructions(recipe.strInstructions);

      result.innerHTML += `
         <div class="meal-image-container">
            <img loading="lazy" src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="meal-image" />
         </div>
         <div class="meal-info-container">
            <h2 class="meal-title">${recipe.strMeal}</h2>
            <p class="meal-id" id="${recipe.idMeal}">${recipe.idMeal}</p>
            <h3>Ingredients</h3>
            <ol class="ingredient-list">
               ${ingredientsHTML}
            </ol>
            <h3>Instructions</h3>
            <ol class="instruction-steps">
               ${instructionsHTML}
            </ol>
         </div>
      `
   })
}
const testFetch = fetchRecipes()
console.log(testFetch);