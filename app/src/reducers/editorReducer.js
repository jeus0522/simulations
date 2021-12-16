import { COPY_TEXT_TO_EDITOR, CLEAR_EDITOR, SAVE_LAYOUT_CONFIG } from '../actions/actionConst';
import { editorFields, editorFieldValues } from '../utils/config';

const initialState = {
	editorFields: [
		{
			id: 'kb-title',
			label: 'Title',
			multiline: false,
			numberOfLines: 1,
			contextMenuText: 'Copy to Title',
			whereToCopy: 'editorDataTitle',
			valueName: 'editorDataTitle',
			isTextField: true,
			editorDataTitle: ''
		},
		{
			id: 'kb-summary',
			label: 'Summary',
			multiline: true,
			numberOfLines: 4,
			contextMenuText: 'Copy to Summary',
			whereToCopy: 'editorDataSummary',
			valueName: 'editorDataSummary',
			isTextField: true,
			editorDataSummary: ''
		},
		{
			id: 'kb-applies',
			label: 'Applies to',
			multiline: true,
			numberOfLines: 4,
			contextMenuText: 'Copy to Applies to',
			whereToCopy: 'editorDataAppliesTo',
			valueName: 'editorDataAppliesTo',
			isTextField: true,
			editorDataAppliesTo: ''
		},
		{
			id: 'kb-description',
			label: 'Description',
			multiline: true,
			numberOfLines: 4,
			contextMenuText: 'Copy to Description',
			whereToCopy: 'editorDataDescription',
			valueName: 'editorDataDescription',
			isTextField: true,
			editorDataDescription: ''
		}
	],
	editorData: {
		editorDataTitle: '',
		editorDataSummary: '',
		editorDataAppliesTo: '',
		editorDataDescription: ''
	},
	text: ''
};

const editorReducer = (state = initialState, action) => {
	switch (action.type) {
		case COPY_TEXT_TO_EDITOR: {
			let updatedEditorData = { ...initialState.editorData };
			updatedEditorData[action.payload.whereToCopy] = action.payload.text;
			return {
				...state,
				editorData: updatedEditorData
			};
		}
		case CLEAR_EDITOR: {
			return initialState;
		}
		case SAVE_LAYOUT_CONFIG: {
			return {
				...state,
				editorFields: action.payload.editorFields,
				editorData: action.payload.editorFieldValues
			};
		}
		default: {
			return state;
		}
	}
};

export default editorReducer;
