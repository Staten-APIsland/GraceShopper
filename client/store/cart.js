import axios from 'axios';
import history from '../history';
import {getUser} from './user';

/* EV: functionalities that should be brought in here:
1. add an item to the cart
2. remove an item from the cart
3. see my cart (this is going to be tied to the nav bar - you click a button that says "my cart")
4. submit my cart (i.e. make purchase) - includes decrementing our stock */

/**
 * ACTION TYPES
 */
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const CHECKOUT = 'CHECKOUT';
const CALC_TOTAL = 'CALC_TOTAL';
const EMPTY_CART = 'EMPTY_CART';
// for thunk creator, need two actions - one to dispatch when you want to see the cart, the other when you got the cart and want to update state accordingly
const GOT_CART = 'GOT_CART';

/**
 * INITIAL STATE
 */
const defaultCart = {
  orderId: 0,
  products: [],
  total: 0
};

/**
 * ACTION CREATORS
 */
export const addToCart = product => ({type: ADD_TO_CART, product});
export const removeFromCart = productId => ({
  type: REMOVE_FROM_CART,
  productId
});
export const checkout = () => ({type: CHECKOUT});
export const calcTotal = () => ({type: CALC_TOTAL});
export const emptyCart = () => ({type: EMPTY_CART});
export const gotCart = (cartContents, cartId) => ({
  type: GOT_CART,
  cartContents,
  cartId
});

/**
 * THUNK CREATORS
 */

// decrement or destroy cart item

// get or create cart
export const getCartId = userId => async dispatch => {
  const data = await axios.get(`api/users/${userId}`);
  const {orders} = data;
  const openCart = orders.filter(order => order.status === 'in cart');
  if (openCart) dispatch(getCart());
};

// thunk creator dispatched when fetching the cart - takes the cart's order ID and fetches its contents from orderItems. This is dispatched from User - because user's Order histry is now loaded when they log in
export const getCartItemsThunkCreator = orderId => async dispatch => {
  // ajax get request to orderItems table
  const {data} = await axios.get(`/api/orderItems/${orderId}`);

  dispatch(gotCart(data, orderId));
  // update cart total thunk also needs to run here
};

export const createCartThunkCreator = userId => async dispatch => {
  try {
    const {data} = await axios.post('/api/orders/', {
      status: 'in cart',
      userId: userId
    });
    dispatch(gotCart(data));
  } catch (error) {
    console.error(error);
  }
};

export const addToCartThunk = productId => async (dispatch, getState) => {
  try {
    let state = getState();
    console.log({state});
    if (state.user.id) {
      await axios.post(`/api/orderItems/${state.cart.orderId}`, {productId});
    }
    const selectedProduct = state.cart.products.find(
      product => product.id === Number(productId)
    );
    dispatch(addToCart(selectedProduct));
  } catch (error) {
    console.error(error);
  }
};

// CREATE CART THUNK CREATOR

/**
 * REDUCER
 */

// eslint-disable-next-line complexity
export default function(state = defaultCart, action) {
  switch (action.type) {
    case GOT_CART: {
      // replace whatever is in the state cart with the stuff that just came back from the DB
      return {...state, products: action.cartContents, orderId: action.cartId};
    }
    case ADD_TO_CART: {
      // when add to cart button clicked, update cart prop on state to include this new item
      // also needs to take care of the price - find the new item's price and add it to the current total

      //this code takes care of if the item is already in cart - will increase quantity by 1

      const updatedProducts = [...state.products];
      if (!updatedProducts.length) updatedProducts.push(action.product);
      else {
        console.log(updatedProducts);
        const productToAdd = updatedProducts.find(
          item => item.id === action.product.id
        );
        if (productToAdd) productToAdd.quantity++;
        else updatedProducts.push(action.product);
      }
      return {
        ...state,
        products: updatedProducts
      };
    }
    case REMOVE_FROM_CART: {
      // find the removed product via product id and return the cart without it
      const updatedProducts = [...state.products];
      const itemToDecrease = updatedProducts.find(
        item => item.id === Number(action.productId)
      );
      itemToDecrease.quantity--;
      if (itemToDecrease.quantity === 0) {
        updatedProducts.splice(updatedProducts.indexOf(itemToDecrease), 1);
      }
      return {
        ...state,
        products: updatedProducts
      };
    }
    case CALC_TOTAL:
      // every element in the "products" array has a price - add them up
      return {
        ...state,
        total: state.products.reduce((acc, currProd) => {
          return currProd.price * currProd.quantity + acc;
        }, 0)
      };
    case EMPTY_CART:
      return defaultCart;
    case CHECKOUT:
      // when checkout button is clicked (TIER 1), clear the cart and the total
      return defaultCart;
    default:
      return state;
  }
}
