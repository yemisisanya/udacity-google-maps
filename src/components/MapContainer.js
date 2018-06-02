import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {zomatoAPI} from '../misc data/ZomatoAPI.js';
import propTypes from 'prop-types'
import List from './List.js'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {styles} from '../misc data/styles.js'
import FaBars from 'react-icons/lib/fa/bars';
import PropTypes from 'prop-types'


export default class MapContainer extends Component {
static propTypes = {
    google: PropTypes.object.isRequired

  }
  constructor(props){
    super(props)
  this.state = {
    places: [],
     filtered: [],
     search: '',
     showList: true
  }

}
  componentDidMount() {

    //set the map details
    if (this.props && this.props.google) { 
      const {google} = this.props; 
      const maps = google.maps; 
      const infowindow = new maps.InfoWindow({maxWidth:'350'})
      const mapRef = this.refs.map; 
      const node = ReactDOM.findDOMNode(mapRef); 

      const mapConfig = Object.assign({}, {
        center: { lat: 51.0486, lng: -114.0708 }, 
        zoom: 12, 
        mapTypeId: 'roadmap',
        styles: styles 
      })

      this.map = new maps.Map(node, mapConfig); 

     // get data from Zomato API
      zomatoAPI()
      .then(p => {
        this.setState({
          places:p,
          filtered: p,
          infowindow: infowindow

        })
   
       p.forEach( location => { // load properties of each location on marker for each location in the API
        location.marker = new google.maps.Marker({ 
          position: {lat: Number(location.location.latitude), lng: Number(location.location.longitude)}, 
          map: this.map, 
          animation: maps.Animation.DROP,
          title: location.name,
          cuisines: location.cuisines,
          rateText: location.user_rating.rating_text,
          rating: location.user_rating.aggregate_rating,
          photo: location.featured_image,
          price: location.price_range
        });
        
       const toggle = ()=> { //animate the marker when clicked
         if(location.marker.getAnimation() !==null){
          location.marker.setAnimation(null);
         } 
         else
         {
          location.marker.setAnimation(maps.Animation.BOUNCE);
          setTimeout( ()=> {
            location.marker.setAnimation(null);
          }, 1000);
         }
        }

        location.marker.addListener('click', function (){ // On marker click
         if(this.price === 1){
          this.price = '$'
         }
         else if(this.price === 2){
          this.price = '$$'
         }

         else if (this.price === 3){
          this.price = '$$$'
         }
          else if (this.price === 4){
          this.price = '$$$$'
         }
          else if (this.price === 5){
          this.price = '$$$$$'
         }
  const content = //infowindow content
           `
          <div class="content" >
           <h3 tabIndex="1" class="title">${this.title}</h3>
           <div tabIndex="2" class="content_body">
           <div class="info_photo col-xm-6 col-sm-6">
                                  <img tabIndex="3" class="photo" height= 70px width=70px src=${this.photo} alt="${this.title}">
                                 </div>
                                 <div tabIndex="4" class="info_body col-xm-6 col-sm-6" >    
                                    <p>Cuisine: ${this.cuisines}</p>
                                    <p>Rating: ${this.rateText}, ${this.rating}</p>
                                    <p>Price: ${this.price}</p>
                          </div>  
                          </div>        
                         </div>           `
                    
        infowindow.setContent(content) //set content to infowindow
          closeToggle() 
          infowindow.open(this.map, this)
          toggle()
        })

        //on marker click, close the list menu
       const closeToggle =() => {
         const {showList} = this.state
         
               this.setState( { showList: true});
        }
      })
    })
  }
   else {
   return ( `<h2> Map did not load! </h2>`)
  }
  
}
filter = (e) => { //Add list of restaurants to the map and filter by restaurant name
    const { places, filtered, infowindow} = this.state;
    const search = e.target.value;
    this.setState({ search: search})
     infowindow.close()
    const filter = places.filter((list) => { //filter by search 
      const restaurantMatch = list.name.toLowerCase().includes(search);
      list.marker.setVisible(restaurantMatch);
      return restaurantMatch;
    })
    this.setState({filtered: filter })
  }

displayInfo = (list) => { //trigger a marker once a restaurant name is clicked
    const {google, infowindow} = this.props; 
    google.maps.event.trigger(list.marker,'click');
  }

toggleList = () => { //toggle the list menu open or close
    const {showList, infowindow } = this.state;
      this.setState( { showList: !showList});
  }

  render() {
    const style = {
      height: '100vh'  
    }
   const {filtered, search, showList} = this.state

   if(!filtered) {
    return <div> Data from Zomato cannot be accessed at the moment. Please try again later</div>
   }

   else if (filtered){
    return ( 
     
     <div className="row list_container" role="map container">
     <nav className="nav col-md-12" tabIndex={0} >
     <FaBars  aria-label="Navigation Bar to see a list of restaurants in Calgary" tabIndex={showList ? '1' : '-1'} className="fabars " onClick={this.toggleList} />
       </nav>
       
        <section id="list" className={ !showList ? "list open" : "list"} > 
          <h2 tabIndex={2} className="header" >Calgary Restaurants </h2>
          
     <input tabIndex={3} className="input" aria-label="input textbox to filter for restaurants" type="text"
            placeholder="filter for restaurants"
            value={search}
            onChange={ this.filter}
          />
     {filtered.length > 0 ?
     <ul tabIndex={4}>
      {filtered.sort((a,b) => {if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0}).map((list, id) =>
      <List 
      key={list.id}
      list={list}
      />
      )}
      </ul>
      :<p>No match</p>
    }
      </section>
     
     <section className="col-md-12">
      <div tabIndex={showList ? '5' : '-1'} className="map" ref="map" style={style}>
        loading map...
      </div>
      </section>
      </div>
    )
  } 
  else{
    return <h3>Loading Restaurants...</h3>
  }
}
}
