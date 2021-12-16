import { COPY_TEXT_TO_EDITOR, CLEAR_EDITOR, SAVE_LAYOUT_CONFIG } from './actionConst';

function copyAction(text, whereToCopy) {
	return {
		type: COPY_TEXT_TO_EDITOR,
		payload: {
			text: text,
			whereToCopy: whereToCopy
		}
	};
}

function clearAction() {
	return {
		type: CLEAR_EDITOR
	};
}

function saveAction(editorFields, editorFieldValues) {
	return {
		type: SAVE_LAYOUT_CONFIG,
		payload: {
			editorFields: editorFields,
			editorFieldValues: editorFieldValues
		}
	};
}

export const copyTextToEditor = (text, whereToCopy) => {
	return (dispatch) => {
		dispatch(copyAction(text, whereToCopy));
	};
};

export const clearEditor = () => {
	return (dispatch) => {
		dispatch(clearAction());
	};
};

export const saveLayoutConfig = (editorFields, editorFieldValues) => {
	return (dispatch) => {
		dispatch(saveAction(editorFields, editorFieldValues));
	};
};
