import { SET_NEW_SNACKBAR_MESSAGE, CLEAN_SNACKBAR_MESSAGE } from '../actions/actionConst';

const initialState = {
	snackbarMessage: '',
	snackbarAlertType: ''
};

const snackbarReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_NEW_SNACKBAR_MESSAGE: {
			return {
				snackbarMessage: action.payload.message,
				snackbarAlertType: action.payload.alertType
			};
		}
		case CLEAN_SNACKBAR_MESSAGE: {
			return {
				snackbarMessage: '',
				snackbarAlertType: ''
			};
		}
		default: {
			return state;
		}
	}
};

export default snackbarReducer;
