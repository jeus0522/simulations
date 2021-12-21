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
  GET_QUERY_DATA_BY_CASE_ID_REQUEST,
} from "../actions/actionConst";

const initialState = {
  response: {},
  answers: [],
  similarAnswers: [],
  originalCase: {},
  selectedCases: [],
  caseID: "",
  dateCreated: "",
  dateResolved: "",
  caseSubject: "",
  caseDescription: "",
  message: "",
  loadingCaseDetails: false,
  loadingAnswers: false,
  loadingSimilarAnswers: false,
  loadingComments: false,
  loadingDataQuery: false,
  copiedSearchText: "",
};

const caseDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ANSWERS_BY_CASEID_REQUEST: {
      return {
        ...state,
        loadingCaseDetails: true,
      };
    }
    case GET_ANSWERS_BY_CASEID_SUCCESS: {
      let basicCaseData = action.payload.response;
      const parsedCaseId = basicCaseData.source_name.split(" ");
      basicCaseData.parsedCaseId = parsedCaseId[1];
      basicCaseData.originalCase = true;
      return {
        ...state,
        originalCase: basicCaseData,
        response: action.payload.response,
        caseID: action.payload.caseID,
        //dateCreated: new Date(basicCaseData.dates[0]).toLocaleDateString(),
        // dateResolved: action.payload.response.dateResolved,
        caseSubject: basicCaseData.answer,
        caseDescription: basicCaseData.context.text,
        message: "",
        loadingCaseDetails: false,
      };
    }
    case GET_ANSWERS_BY_CASEID_FAILURE: {
      return {
        ...state,
        response: {},
        caseID: "",
        dateCreated: "",
        dateResolved: "",
        caseSubject: "",
        caseDescription: "",
        message: "No Case Found",
        loadingCaseDetails: false,
      };
    }
    case GET_ANSWERS_REQUEST: {
      return {
        ...state,
        answers: [],
        loadingAnswers: true,
      };
    }
    case GET_ANSWERS_SUCCESS: {
      const parsedAnswers = action.payload.response.answers.Tickets.map(
        (answer) => {
          const parsedCaseId = answer.source_name.split(" ");
          answer.parsedCaseId = parsedCaseId[1];
          return answer;
        }
      );

      return {
        ...state,
        answers: parsedAnswers,
        loadingAnswers: false,
      };
    }
    case GET_ANSWERS_FAILURE: {
      return {
        ...state,
        answers: [],
        loadingAnswers: false,
      };
    }

    case GET_SIMILAR_TICKETS_REQUEST: {
      return {
        ...state,
        similarAnswers: [],
        loadingSimilarAnswers: true,
      };
    }
    case GET_SIMILAR_TICKETS_SUCCESS: {
      const parsedSimilarAnswers = action.payload.response.duplicated_list.map(
        (answer, index) => {
          const parsedCaseId = answer.source_name.split(" ");
          answer.parsedCaseId = parsedCaseId[1];
          answer.answerid = `sa-${parsedCaseId[1]}-${index}`;
          answer.answer = answer.title;
          answer.context = { text: answer.text };
          delete answer.title;
          delete answer.text;
          return answer;
        }
      );

      return {
        ...state,
        similarAnswers: parsedSimilarAnswers,
        loadingSimilarAnswers: false,
      };
    }
    case GET_SIMILAR_TICKETS_FAILURE: {
      return {
        ...state,
        similarAnswers: [],
        loadingSimilarAnswers: false,
      };
    }

    case ADD_SELECTED_CASE: {
      const caseExists = state.selectedCases.find(
        (e) => e.answerid === action.payload.case.answerid
      );
      if (caseExists) {
        return state;
      }
      return {
        ...state,
        selectedCases: [...state.selectedCases, action.payload.case],
      };
    }
    case REMOVE_SELECTED_CASE: {
      var filtered = state.selectedCases.filter(function (el) {
        return el.answer !== action.payload.case;
      });
      return {
        ...state,
        selectedCases: filtered,
      };
    }
    case COPY_TEXT_TO_SEARCH: {
      return {
        ...state,
        copiedSearchText: action.payload.text,
      };
    }
    case CLEAR_CASE_DETAILS: {
      return initialState;
    }
    case GET_COMMENTS_REQUEST: {
      return {
        ...state,
        loadingComments: true,
      };
    }
    case GET_COMMENTS_SUCCESS: {
      let basicCaseData = action.payload.response;
      const parsedCaseId = basicCaseData.source_name.split(" ");
      basicCaseData.parsedCaseId = parsedCaseId[1];

      let updatedAnswers = [...state[action.payload.commentsFor]];
      const findFieldToUpdate = (element) =>
        element.parsedCaseId === basicCaseData.parsedCaseId;
      const fieldToUpdate = updatedAnswers.findIndex(findFieldToUpdate);

      updatedAnswers[fieldToUpdate].comments = basicCaseData.comments;
      return {
        ...state,
        [action.payload.commentsFor]: updatedAnswers,
        loadingComments: false,
      };
    }
    case GET_COMMENTS_FAILURE: {
      return {
        ...state,
        loadingComments: false,
      };
    }
    case GET_QUERY_DATA_BY_CASE_ID_REQUEST: {
      return {
        ...state,
        loadingDataQuery: true,
      };
    }
    case GET_QUERY_DATA_BY_CASE_ID_SUCCESS: {
      let basicCaseData = action.payload.response[0];
      basicCaseData.parsedCaseId = action.payload.caseID;

      let updatedSelectedCases = [...state.selectedCases];
      const findFieldToUpdate = (element) =>
        element.parsedCaseId === basicCaseData.parsedCaseId;
      const fieldToUpdate = updatedSelectedCases.findIndex(findFieldToUpdate);

      updatedSelectedCases[fieldToUpdate].dataQuery = basicCaseData;

      return {
        ...state,
        selectedCases: updatedSelectedCases,
        loadingDataQuery: false,
      };
    }
    case GET_QUERY_DATA_BY_CASE_ID_FAILURE: {
      return {
        ...state,
        loadingDataQuery: false,
      };
    }

    default: {
      return state;
    }
  }
};

export default caseDetailsReducer;
