import { SET_NEW_SNACKBAR_MESSAGE, CLEAN_SNACKBAR_MESSAGE } from './actionConst';

function setNewSnackbarMessageRequest(message, alertType) {
	return {
		type: SET_NEW_SNACKBAR_MESSAGE,
		payload: { message, alertType }
	};
}

function cleanSnackbarMessageRequest() {
	return {
		type: CLEAN_SNACKBAR_MESSAGE
	};
}

export const setNewSnackbarMessage = (message, alertType) => {
	return (dispatch) => {
		dispatch(setNewSnackbarMessageRequest(message, alertType));
	};
};

export const cleanSnackbarMessage = () => {
	return (dispatch) => {
		dispatch(cleanSnackbarMessageRequest());
	};
};
