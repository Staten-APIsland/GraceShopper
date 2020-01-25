import axios from 'axios';
import history from '../history';
import {addToCart, addToCartThunk} from './cart';

/**
 * ACTION TYPES
 */
const GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS';

/**
 * INITIAL STATE
 */
const initialState = {
  products: [],
  product: {}
};

/**
 * ACTION CREATORS
 */
const getAllProducts = products => ({
  type: GET_ALL_PRODUCTS,
  products
});

/**
 * THUNK CREATORS
 */
export const getAllProductsThunk = () => async dispatch => {
  try {
    const res = await axios.get('/api/products');
    dispatch(getAllProducts(res.data || products));
  } catch (err) {
    console.error(err);
    //need to change this to handle errors
  }
};

export const addToCartThunkProducts = product => (dispatch, getState) => {
  const state = getState();
  // wrap the backend thunk with if statement to see if order Id doesn't exist
  if (state.cart.orderId > 0) {
    dispatch(addToCartThunk(product.id));
    // if there's an orderId, I want to go to the backend. if not, just frontend.
    // ajax to create new row in orderItems
  }
  dispatch(addToCart(product));
};

/**
 * REDUCER
 */
export default function(state = initialState.products, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return action.products;
    default:
      return state;
  }
}
