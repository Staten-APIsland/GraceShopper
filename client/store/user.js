import axios from 'axios';
import history from '../history';
import {clearCart} from '../store/localStorage';
import {emptyCart} from '../store/cart';

/**
 * ACTION TYPES
 */

const GET_USER = 'GET_USER';
const REMOVE_USER = 'REMOVE_USER';
const CREATE_USER = 'CREATE_USER';
const UPDATE_USER = 'UPDATE_USER';

/**
 * INITIAL STATE
 */
const defaultUser = {};

/**
 * ACTION CREATORS
 */

export const getUser = user => ({type: GET_USER, user});
const removeUser = () => ({type: REMOVE_USER});
const createUser = user => ({type: CREATE_USER, user});
const updateUser = user => ({type: UPDATE_USER, user});

/**
 * THUNK CREATORS
 */
export const me = user => async dispatch => {
  try {
    const res = await axios.get('/auth/me', user);
    dispatch(getUser(res.data || defaultUser));
    // dispatch thunk that goes to the cart reducer with the user's ID
  } catch (err) {
    console.error(err);
  }
};

// EV: this used to be export const auth = (email, password, method), which implies there's a way to both authorize an existing user and sign up a new user. I can't think of a way to do that quickly now, and I prefer to be explicit anyway, so I'm separating auth from signup and removing the method argument. This thunk creator will only refer to logging in, there will be a separate one for signing up
export const auth = (email, password) => async dispatch => {
  let res;
  try {
    res = await axios.post(`/auth/login`, {email, password});
  } catch (authError) {
    return dispatch(getUser({error: authError}));
  }

  try {
    dispatch(getUser(res.data));
    history.push('/home');
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr);
  }
};

export const getUserThunk = () => async dispatch => {
  try {
    const res = await axios.get('/api/users/profile', {withCredentials: true});
    dispatch(getUser(res.data));
  } catch (err) {
    console.error(err);
  }
};

export const updateUserThunk = data => async dispatch => {
  let res;
  try {
    res = await axios.put('api/users/profile', data, {
      withCredentials: true
    });
    dispatch(updateUser(res.data));
  } catch (err) {
    console.log(err);
  }
};

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout');
    dispatch(removeUser());
    clearCart();
    dispatch(emptyCart());
    history.push('/login');
  } catch (err) {
    console.error(err);
  }
};

export const signUp = user => async dispatch => {
  let newUser;
  try {
    // ajax to create new row in users table
    newUser = await axios.post('/auth/signup', user);
    // dispatch create user
    dispatch(createUser(user));
  } catch (error) {
    console.error(error);
  }

  // then go to user page - i.e getUser on this new user, use newUser.data.email etc
  try {
    dispatch(getUser(newUser.data));
    history.push('/home');
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr);
  }
};
/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case REMOVE_USER:
      return defaultUser;
    case CREATE_USER:
      return action.user;
    default:
      return state;
  }
}
