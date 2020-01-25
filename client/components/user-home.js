import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getCartItemsThunkCreator, createCartThunkCreator} from '../store/cart';
/**
 * COMPONENT
 */

export class UserHome extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // on component did mount, check if the orders array includes one that's pending. If so, call getCartItemsThunkCreator on it. If not, call createCartThunkCreator.
    let openCart = null;
    if (this.props.orders) {
      openCart = this.props.orders.filter(order => order.status === 'in cart');
      // if there is an open cart, get its ID and thunk to get the items
      if (!openCart[0]) {
        // if no open cart, create one
        this.props.createCart(this.props.userId);
      } else {
        this.props.getCartItems(openCart[0].id);
      }
    }
  }
  render() {
    const {email} = this.props;
    return (
      <div id="user-page-wrapper">
        <h3>Welcome, {email}</h3>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  console.log(state);
  return {
    email: state.user.email,
    name: state.user.firstName,
    orders: state.user.orders,
    userId: state.user.id
  };
};
const mapDispatch = dispatch => {
  return {
    getCartItems: cartId => {
      console.log('about to dispatch get cart items thunk creator');
      return dispatch(getCartItemsThunkCreator(cartId));
    },
    createCart: userId => dispatch(createCartThunkCreator(userId))
  };
};

export default connect(mapState, mapDispatch)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
};
