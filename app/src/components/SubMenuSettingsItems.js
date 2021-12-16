import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { getSubListStyle, getSubItemStyle } from "../utils/menuHelpers";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, Grid } from "@mui/material";

const SubMenuSettingsItems = (props) => {
  const { subItems, type } = props;
  return (
    <Droppable droppableId={type} type={`droppableSubItem`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getSubListStyle(snapshot.isDraggingOver)}
        >
          {subItems.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <div style={{ display: "flex" }}>
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getSubItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item xs={10} sx={{ textAlign: "initial" }}>
                          {item.label}
                        </Grid>
                        <Grid item xs={2}>
                          <span {...provided.dragHandleProps}>
                            <DragIndicatorIcon />
                          </span>
                        </Grid>
                      </Grid>
                    </Box>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default SubMenuSettingsItems;
