import {
  GET_SIMULATION_FRAMES_FAILURE,
  GET_SIMULATION_FRAMES_SUCCESS,
  GET_SIMULATION_FRAMES_REQUEST,
} from "../actions/actionConst";

const initialState = {
  steps: [],
  isStepsLoading: false,
};

const simulationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SIMULATION_FRAMES_REQUEST: {
      return {
        ...state,
        isStepsLoading: true,
      };
    }
    case GET_SIMULATION_FRAMES_SUCCESS: {
      //   let basicCaseData = action.payload.response;
      //   const parsedCaseId = basicCaseData.source_name.split(" ");
      //   basicCaseData.parsedCaseId = parsedCaseId[1];
      //   basicCaseData.originalCase = true;
      return {
        ...state,
        steps: action.payload.response,
        isStepsLoading: false,
      };
    }
    case GET_SIMULATION_FRAMES_FAILURE: {
      return {
        ...state,
        isStepsLoading: false,
      };
    }

    default: {
      return state;
    }
  }
};

export default simulationReducer;
