export function getFavorites() {
   const favorites = localStorage.getItem("favoriteMeals");
   return favorites ? JSON.parse(favorites) : [];
}

export function toggleFavorite(mealId) {
   let favorites = getFavorites();
   if (favorites.includes(mealId)) {
      favorites = favorites.filter(id => id !== mealId);
   } else {
      favorites.push(mealId);
   }

   localStorage.setItem("favoriteMeals", JSON.stringify(favorites));
   return favorites;
}

export function isMealFavorite(mealId) {
   const favorites = getFavorites();
   return favorites.includes(mealId);
}