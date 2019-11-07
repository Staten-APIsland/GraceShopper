import axios from 'axios';
import history from '../history';

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER';
const REMOVE_USER = 'REMOVE_USER';
const CREATE_USER = 'CREATE_USER';

/**
 * INITIAL STATE
 */
const defaultUser = {};

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user});
const removeUser = () => ({type: REMOVE_USER});
const createUser = user => ({type: CREATE_USER, user});

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me');
    dispatch(getUser(res.data || defaultUser));
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

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout');
    dispatch(removeUser());
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
