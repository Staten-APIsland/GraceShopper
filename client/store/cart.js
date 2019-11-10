import axios from 'axios';
import history from '../history';

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
// for thunk creator, need two actions - one to dispatch when you want to see the cart, the other when you got the cart and want to update state accordingly
const GOT_CART = 'GOT_CART';

/**
 * INITIAL STATE
 */
const defaultCart = {
  orderItems: [],
  total: 0
};

/**
 * ACTION CREATORS
 */
export const addToCart = item => ({type: ADD_TO_CART, item});
export const removeFromCart = item => ({type: REMOVE_FROM_CART, item});
export const checkout = () => ({type: CHECKOUT});
export const calcTotal = () => ({type: CALC_TOTAL});
export const gotCart = cart => ({type: GOT_CART, cart});

/**
 * THUNK CREATORS
 */

export const getCartIdThunkCreator = userId => async dispatch => {
  try {
    // get the user's object
    const {data} = await axios.get(`/users/${userId}`);
    // in data of user's object, their orders are eager-loaded in an array.
    const {orders} = data;
    const curCart = orders.filter(order => {
      return order.status === 'in cart';
    });
    // if that array is empty, create new cart
    if (!curCart.id) {
      // dispatch create cart thunk
      dispatch(createCartThunkCreator(userId));
    } else {
      // else if any of them are in cart, return that order
      dispatch(getCartThunkCreator(curCart.id));
    }
  } catch (error) {
    console.error(error);
  }
};

export const getCartThunkCreator = cartId =>
  // the contents of a cart will be eager-loaded with the order number from the order table!
  async dispatch => {
    try {
      // get all orderItems that are in the cart - orderItem table
      const {data} = await axios.get(`api/orders/${cartId}`);
      dispatch(gotCart(data));
    } catch (error) {
      console.error(error);
    }
  };

export const createCartThunkCreator = userId =>
  // create new row in orders table, with user id and status "in cart"
  async dispatch => {
    try {
      const {data} = await axios.post('/api/orders/', {
        userId,
        status: 'in cart'
      });
      dispatch(gotCart(data));
    } catch (error) {
      console.error(error);
    }
  };

export const addToCartThunkCreator = (cartId, productId) => async dispatch => {
  try {
    // ajax to create new row in the orderItem table
    const newOrderItem = await axios.post(`/api/orderItems/${cartId}`, {
      productId
    });
    // fetch the cart again
    dispatch(addToCart(newOrderItem));
  } catch (error) {
    console.error(error);
  }
};

export const checkoutThunkCreator = cartId =>
  // the contents of a cart will be eager-loaded with the order number from the order table!
  async dispatch => {
    try {
      // ajax to change the status of the order
      await axios.put(`api/orders/${cartId}`, {
        status: 'processing'
      });
      // create new cart immediately and fetch it
      dispatch(createCartThunkCreator());
    } catch (error) {
      console.error(error);
    }
  };

/**
 * REDUCER
 */

export default function(state = defaultCart, action) {
  switch (action.type) {
    case GOT_CART:
      // when new or existing cart comes back from api, return the cart as a new state (replace whole state!)
      return action.cart;
    case ADD_TO_CART:
      // when add to cart button clicked, update cart prop on state to include this new item
      // also needs to take care of the price - find the new item's price and add it to the current total
      return {
        ...state,
        orderItems: [...state.orderItems, action.item],
        total: state.total + action.item.price
      };
    case REMOVE_FROM_CART:
      // find the removed product via product id and return the cart without it
      return {
        ...state,
        orderItems: state.orderItems.map(product => {
          if (product.id !== action.product.id) {
            return product;
          }
        })
      };
    case CALC_TOTAL:
      // every element in the "orderItems" array has a price - add them up
      return {...state, total: state.orderItems.reduce(() => {}, state.total)};
    default:
      return state;
  }
}
