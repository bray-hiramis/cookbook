const mealDBAPI = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const mealById = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

export async function searchMeal(meal) {
   let result = [];
   try {
      const recipe = mealDBAPI + meal;
      let response = await fetch(recipe);
      let data = await response.json();
      result = data.meals;
      console.log(result);
      return result;
   } catch (error) {
      console.error("Error occured:", error);
   }
}

export async function searchMealById(mealId) {

   let result = [];

   try {
      const recipe = mealById + mealId;
      let response = await fetch(recipe);
      let data = await response.json();
      result = data.meals;
      console.log(result);
      return result;
   } catch (error) {
      console.log("Error occured:", error);
   }

}