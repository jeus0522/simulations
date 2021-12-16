import { combineReducers } from "redux";

import authReducer from "./authReducer";
import caseDetailsReducer from "./caseDetailsReducer";
import editorReducer from "./editorReducer";
import snackbarReducer from "./snackbarReducer";
import simulationReducer from "./simulationReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  caseDetails: caseDetailsReducer,
  editor: editorReducer,
  snackbar: snackbarReducer,
  simulation: simulationReducer,
});

export default rootReducer;
