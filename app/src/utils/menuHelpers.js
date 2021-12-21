// a little function to help us with reordering the result
export const Reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 7;
export const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 4px 0`,
  textAlign: "right",

  // change background colour if dragging
  background: isDragging ? "indigo" : "#121212",

  // styles we need to apply on draggables
  ...draggableStyle,
});

export const getSubItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  display: "inline-flex",
  width: "100%",
  padding: "10px",

  // change background colour if dragging
  background: isDragging ? "indigo" : "#121212",
  margin: "0 0px 5px 0",
  border: "1px solid grey",
  // styles we need to apply on draggables
  ...draggableStyle,
});

export const getSubListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#7b1fa2" : "grey",
  padding: 4,
  margin: "5px 0",
});

export const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#7b1fa2" : "grey",
  padding: 4,
  width: 450,
});
