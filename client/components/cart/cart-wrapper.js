import React from 'react';
import {connect} from 'react-redux';

import {
  addToCartThunk,
  removeFromCart,
  calcTotal,
  checkout
} from '../../store/cart';
import {Cart, EmptyCart} from '../cart';

export class CartWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
  }

  componentDidMount() {
    // re-calculate the total
    this.props.calcTotal();
  }

  handleAdd(event) {
    // add a copy of the target of the event to the list of items
    // the end goal is to pass id into a thunk that will use getState to access the product list and send that product info along to the action creator
    event.preventDefault();
    this.props.incrementQuantity(event.target.id);
    this.props.calcTotal();
  }

  handleRemove(event) {
    // remove one item of this kind from the array of items in cart
    event.preventDefault();
    this.props.decreaseQuantity(event.target.id);
    this.props.calcTotal();
  }

  handleCheckout(event) {
    if (event.target) event.preventDefault();
    this.props.checkoutAction();
  }
  render() {
    return this.props.itemsInCart.length > 0 ? (
      <div id="cart-wrapper">
        <Cart
          cartItems={this.props.itemsInCart}
          handleAdd={this.handleAdd}
          handleRemove={this.handleRemove}
          handleCheckout={this.handleCheckout}
          total={this.props.total}
        />
      </div>
    ) : (
      <EmptyCart />
    );
  }
}

// get the list of items in the cart from the store
const mapStateToProps = function(state) {
  return {
    itemsInCart: state.cart.products,
    total: state.cart.total
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    // get the add item function from store
    incrementQuantity: productId => dispatch(addToCartThunk(productId)),
    // get the remove item function
    decreaseQuantity: productId => dispatch(removeFromCart(productId)),
    calcTotal: () => dispatch(calcTotal()),
    checkoutAction: () => dispatch(checkout())
  };
};

const ConnectedCartWrapper = connect(
  mapStateToProps,
  mapDispatchToProps
)(CartWrapper);

export default ConnectedCartWrapper;
