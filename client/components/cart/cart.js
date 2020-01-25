import React from 'react';
import CartItem from './cart-item';
import CheckoutStripe from './checkout-stripe';

const Cart = props => {
  const price = props.total.toString();
  return (
    <div id="cart-page">
      <h1>Your shopping cart</h1>
      <table id="cart">
        <tbody>
          {props.cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              handleAdd={props.handleAdd}
              handleRemove={props.handleRemove}
            />
          ))}
        </tbody>
      </table>
      <div id="cart-total">
        Total: ${price.slice(0, price.length - 2)}.
        {price.slice(price.length - 2)}
      </div>
      <div id="cart-checkout">
        <div id="cart-checkout-main-btn">
          <button type="submit" name="checkout" onClick={props.handleCheckout}>
            Checkout
          </button>
        </div>
        <div id="checkout-stripe">
          <CheckoutStripe handleCheckout={props.handleCheckout} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
