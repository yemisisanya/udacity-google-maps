import React, { Component } from 'react';
import PropTypes from 'prop-types';

class List extends Component {

  static propTypes = {
    list: PropTypes.object.isRequired,
     
  }

  displayInfo = (list) => {
    // force marker click
    window.google.maps.event.trigger(this.props.list.marker,'click');
  }

  render() {

    const {list} = this.props;
    
    return (
      <li>
        <div 
          onClick={this.displayInfo}
          onKeyPress={this.displayInfo}
          >
          {list.name}
        </div>
      </li>
    );
  }
}

export default List;
