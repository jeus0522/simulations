import axios from 'axios';
import {
	GET_ANSWERS_BY_CASEID_SUCCESS,
	GET_ANSWERS_BY_CASEID_FAILURE,
	GET_ANSWERS_BY_CASEID_REQUEST,
	GET_ANSWERS_SUCCESS,
	GET_ANSWERS_FAILURE,
	GET_ANSWERS_REQUEST,
	GET_SIMILAR_TICKETS_SUCCESS,
	GET_SIMILAR_TICKETS_FAILURE,
	GET_SIMILAR_TICKETS_REQUEST,
	ADD_SELECTED_CASE,
	REMOVE_SELECTED_CASE,
	COPY_TEXT_TO_SEARCH,
	CLEAR_CASE_DETAILS,
	GET_COMMENTS_SUCCESS,
	GET_COMMENTS_FAILURE,
	GET_COMMENTS_REQUEST,
	GET_QUERY_DATA_BY_CASE_ID_SUCCESS,
	GET_QUERY_DATA_BY_CASE_ID_FAILURE,
	GET_QUERY_DATA_BY_CASE_ID_REQUEST
} from './actionConst';
import { internalApiURL, similarTicketsApiURL, reportingApiURL } from '../utils/constants';

const auth = localStorage.getItem('token');
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers['Authorization'] = auth;
axios.defaults.headers['Content-Type'] = 'application/json';

function getAnswersByCaseIdSuccess(response, caseID) {
	return {
		type: GET_ANSWERS_BY_CASEID_SUCCESS,
		payload: { response, caseID }
	};
}

function getAnswersByCaseIdFailure(error) {
	return {
		type: GET_ANSWERS_BY_CASEID_FAILURE,
		payload: {
			error
		}
	};
}

function getAnswersByCaseIdRequest() {
	return {
		type: GET_ANSWERS_BY_CASEID_REQUEST
	};
}

function getAnswersSuccess(response) {
	return {
		type: GET_ANSWERS_SUCCESS,
		payload: { response }
	};
}

function getAnswersFailure(error) {
	return {
		type: GET_ANSWERS_FAILURE,
		payload: {
			error
		}
	};
}

function getAnswersRequest() {
	return {
		type: GET_ANSWERS_REQUEST
	};
}

function getSimilarTicketsSuccess(response) {
	return {
		type: GET_SIMILAR_TICKETS_SUCCESS,
		payload: { response }
	};
}

function getSimilarTicketsFailure(error) {
	return {
		type: GET_SIMILAR_TICKETS_FAILURE,
		payload: {
			error
		}
	};
}

function getSimilarTicketsRequest() {
	return {
		type: GET_SIMILAR_TICKETS_REQUEST
	};
}

function addSelectedCase(caseObject) {
	return {
		type: ADD_SELECTED_CASE,
		payload: {
			case: caseObject
		}
	};
}

function removeSelectedCase(caseObject) {
	return {
		type: REMOVE_SELECTED_CASE,
		payload: {
			case: caseObject
		}
	};
}

function copyAction(text) {
	return {
		type: COPY_TEXT_TO_SEARCH,
		payload: {
			text: text
		}
	};
}

function clearAction() {
	return {
		type: CLEAR_CASE_DETAILS
	};
}

function getCommentsSuccess(response, caseID, commentsFor) {
	return {
		type: GET_COMMENTS_SUCCESS,
		payload: { response, caseID, commentsFor }
	};
}

function getCommentsFailure(error) {
	return {
		type: GET_COMMENTS_FAILURE,
		payload: {
			error
		}
	};
}

function getCommentsRequest() {
	return {
		type: GET_COMMENTS_REQUEST
	};
}

function getDataQueryByCaseIdSuccess(response, caseID) {
	return {
		type: GET_QUERY_DATA_BY_CASE_ID_SUCCESS,
		payload: { response, caseID }
	};
}

function getDataQueryByCaseIdFailure(error) {
	return {
		type: GET_QUERY_DATA_BY_CASE_ID_FAILURE,
		payload: {
			error
		}
	};
}

function getDataQueryByCaseIdRequest() {
	return {
		type: GET_QUERY_DATA_BY_CASE_ID_REQUEST
	};
}

export const actionSelectedCase = (caseObject, caseAction) => {
	return (dispatch) => {
		switch (caseAction) {
			case 'ADD':
				dispatch(addSelectedCase(caseObject));
				break;
			case 'REMOVE':
				dispatch(removeSelectedCase(caseObject));
				break;

			default:
				break;
		}
	};
};

export const getAnswersByCaseId = (convid, ds, q, app_name, acl, fields) => {
	const path = `${internalApiURL}/getAnswersByCaseId`;
	const params = { ds, q, auth, app_name, acl, fields };

	return (dispatch) => {
		dispatch(getAnswersByCaseIdRequest());
		return axios
			.get(path, { params })
			.then((response) => response.data)
			.then((event) => {
				dispatch(getAnswersByCaseIdSuccess(event, q));
			})
			.catch((error) => dispatch(getAnswersByCaseIdFailure(error)));
	};
};

export const getAnswers = (question, convid, queryid, tab, ds) => {
	const path = `${internalApiURL}/getAllAnswers`;

	const params = { question, convid, queryid, tab, ds };

	return (dispatch) => {
		dispatch(getAnswersRequest());
		return axios
			.get(path, { params })
			.then((response) => response.data)
			.then((event) => {
				dispatch(getAnswersSuccess(event));
			})
			.catch((error) => dispatch(getAnswersFailure(error)));
	};
};

export const getSimilarTickets = (title, desc, ds, app_name, docid, dup_threshold, solr_nbest) => {
	const path = `${similarTicketsApiURL}/similar_tickets_api`;

	const params = { title, desc, ds, app_name, docid, dup_threshold, solr_nbest };
	const json = JSON.stringify(params);

	return (dispatch) => {
		dispatch(getSimilarTicketsRequest());
		return axios
			.post(path, json)
			.then((response) => response.data)
			.then((event) => {
				dispatch(getSimilarTicketsSuccess(event));
			})
			.catch((error) => dispatch(getSimilarTicketsFailure(error)));
	};
};

export const copyTextToSearch = (text) => {
	return (dispatch) => {
		dispatch(copyAction(text));
	};
};

export const clearCaseDetails = () => {
	return (dispatch) => {
		dispatch(clearAction());
	};
};

export const getComments = (convid, ds, q, app_name, acl, fields, commentsFor) => {
	const path = `${internalApiURL}/getAnswersByCaseId`;
	const params = { ds, q, auth, app_name, acl, fields };

	return (dispatch) => {
		dispatch(getCommentsRequest());
		return axios
			.get(path, { params })
			.then((response) => response.data)
			.then((event) => {
				dispatch(getCommentsSuccess(event, q, commentsFor));
			})
			.catch((error) => dispatch(getCommentsFailure(error)));
	};
};

export const getDataQueryByCaseId = (ds, caseid) => {
	const path = `${reportingApiURL}/GetQueryDataByCaseId`;

	const params = { ds, caseid };
	const json = JSON.stringify(params);

	return (dispatch) => {
		dispatch(getDataQueryByCaseIdRequest());
		return axios
			.post(path, json)
			.then((response) => response.data)
			.then((event) => {
				dispatch(getDataQueryByCaseIdSuccess(event, caseid));
			})
			.catch((error) => dispatch(getDataQueryByCaseIdFailure(error)));
	};
};
