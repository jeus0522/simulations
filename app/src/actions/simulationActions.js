import axios from "axios";
import {
  GET_SIMULATION_FRAMES_FAILURE,
  GET_SIMULATION_FRAMES_SUCCESS,
  GET_SIMULATION_FRAMES_REQUEST,
} from "./actionConst";
import { apiURL } from "../utils/constants";

axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers["Content-Type"] = "application/json";

function getSimulationFramesSuccess(response) {
  return {
    type: GET_SIMULATION_FRAMES_SUCCESS,
    payload: { response },
  };
}

function getSimulationFramesFailure(error) {
  return {
    type: GET_SIMULATION_FRAMES_FAILURE,
    payload: {
      error,
    },
  };
}

function getSimulationFramesRequest() {
  return {
    type: GET_SIMULATION_FRAMES_REQUEST,
  };
}

export const getSimulationFrames = () => {
  const path = `${apiURL}/get_simulation_frames`;

  return (dispatch) => {
    dispatch(getSimulationFramesRequest());
    return axios
      .get(path)
      .then((response) => response.data)
      .then((event) => {
        dispatch(getSimulationFramesSuccess(event));
      })
      .catch((error) => dispatch(getSimulationFramesFailure(error)));
  };
};
