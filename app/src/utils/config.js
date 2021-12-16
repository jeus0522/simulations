export const basicConfig = {
	tabForSimilarCasesSearch: 'Tickets',
	automatedDupThreshold: 0.75,
	automatedsolrNbest: 500
};

export const editorFields = [
	{
		id: 'kb-title',
		label: 'Title',
		multiline: false, // no numberOfLines property if multiline is false
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
];

// {
// 	id: 'kb-content',
// 	label: 'Content',
// 	multiline: false,
// 	contextMenuText: 'Copy to Editor',
// 	whereToCopy: 'editorDataContent',
// 	valueName: 'editorDataContent',
// 	isTextField: false,
// 	editorDataContent: ''
// }

export const editorFieldValues = {
	editorDataTitle: '',
	editorDataSummary: '',
	editorDataAppliesTo: '',
	editorDataDescription: ''
};

//editorDataContent: ''
