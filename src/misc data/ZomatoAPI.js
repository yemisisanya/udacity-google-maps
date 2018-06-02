const URL = 'https://developers.zomato.com/api/v2.1/search?lat=51.0486&lon=-114.0708'
var array_restaurants = [];
let fetchData = {
  method: 'GET',
  headers: {
    "user-key": "a3d22bd4b631d3afcfce992025c676e5",
    "Accept": "application/json",
    'Content-Type': 'application/json'
  }
}
export const zomatoAPI = () => {
  return fetch(URL, fetchData)
    .then(response => {
      if (!response.ok) {
        throw response
      } else return response.json()
    })
    .then(data => {
      const restaurants = data.restaurants

      for (var i = 0; i < restaurants.length; i++) {

        const restaurant_info = restaurants[i].restaurant
        array_restaurants.push(restaurant_info)

      }
      return array_restaurants
    })

}