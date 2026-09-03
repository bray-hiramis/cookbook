const mealDBAPI = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

export async function searchMeal(meal) {
   let result = [];
   try {
      const recipe = mealDBAPI + meal;
      let response = await fetch(recipe);
      let data = await response.json();
      result = data.meals;
      return result;
   } catch (error) {
      console.error("Error occured:", error);
   }
}