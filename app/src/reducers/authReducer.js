import jwtDecode from 'jwt-decode';
import {
	LOGIN_USER_FAILURE,
	LOGIN_USER_REQUEST,
	LOGIN_USER_SUCCESS,
	LOGOUT_USER,
	GET_DS_SUCCESS,
	GET_DS_FAILURE
} from '../actions/actionConst';

const userToken = localStorage.getItem('token');
let userNameFromStore;
if (userToken) {
	userNameFromStore = jwtDecode(userToken).email;
} else {
	userNameFromStore = null;
}

const initialState = {
	loggedIn: userToken ? true : false,
	token: localStorage.getItem('token'),
	redirect: localStorage.getItem('redirect'),
	userName: userNameFromStore ? userNameFromStore : null,
	isAuthenticated: false,
	isAuthenticating: false,
	statusText: null,
	isRegistering: false,
	isRegistered: false,
	registerStatusText: null,
	ds: ''
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOGIN_USER_REQUEST: {
			return {
				...initialState,
				isAuthenticating: true,
				statusText: null
			};
		}
		case LOGIN_USER_SUCCESS: {
			localStorage.setItem('token', action.payload.token);
			localStorage.setItem('usrid', action.payload.usrid);
			localStorage.setItem('convid', action.payload.convid);
			return {
				...state,
				loggedIn: true,
				isAuthenticating: false,
				isAuthenticated: true,
				token: action.payload.token,
				userName: jwtDecode(action.payload.token).email,
				role: jwtDecode(action.payload.token).role,
				statusText: 'You have been successfully logged in.'
			};
		}
		case LOGIN_USER_FAILURE: {
			localStorage.removeItem('token');
			localStorage.removeItem('usrid');
			localStorage.removeItem('convid');
			return {
				...state,
				loggedIn: false,
				isAuthenticating: false,
				isAuthenticated: false,
				token: null,
				userName: null
			};
		}
		case LOGOUT_USER: {
			localStorage.removeItem('token');
			localStorage.removeItem('usrid');
			localStorage.removeItem('convid');
			return {
				...state,
				loggedIn: false,
				isAuthenticating: false,
				isAuthenticated: false,
				token: null,
				userName: null,
				statusText: ''
			};
		}
		case GET_DS_SUCCESS: {
			return {
				...state,
				ds: action.payload.data_source
			};
		}
		case GET_DS_FAILURE: {
			return {
				...state,
				ds: ''
			};
		}

		default: {
			return state;
		}
	}
};

export default authReducer;
