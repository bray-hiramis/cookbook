const mealDBAPI = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

async function searchMeal(meal) {
   let result = [];
   try {
      const recipe = mealDBAPI + meal;
      let response = await fetch(recipe);
      let data = await response.json();
      result = data;
      return result;
   } catch (error) {
      console.error("Error occured:", error);
   }
}

console.log("Meal DB API Result:\n");
console.log(searchMeal("adobo"));
// searchMeal()