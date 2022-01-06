import React from "react";
import { styled } from "@mui/material/styles";

import Agent from "./Agent";
import Food from "./Food";

const BoardContainer = styled("div")(() => ({
  border: "2px solid lightslategray",
  overflow: "hidden",
  padding: 3,
  borderRadius: 5,
  marginTop: 10,
}));

const BoardBorder = styled("div")(() => ({
  borderRadius: 5,
  overflow: "hidden",
}));

const Row = styled("div")(() => ({
  height: 10,
  display: "flex",
  backgroundColor: "lightslategray",
}));

const Cell = styled("div")(() => ({
  height: 10,
  width: 10,
  backgroundColor: "lightslategray",
  marginLeft: 2,
  marginRight: 2,
}));

const Board = (props) => {
  const { grid } = props;
  // debugger;
  return (
    <BoardContainer>
      <BoardBorder>
        {grid.length > 0 &&
          grid.map((cells, index) => (
            <Row key={index}>
              {cells.map((cell, index) => (
                <Cell key={index}>
                  {cell[0] && "actor" in cell[0] ? (
                    <Agent agentData={cell[0].actor.actor} />
                  ) : null}
                  {cell[0] && "food" in cell[0] ? <Food /> : null}
                </Cell>
              ))}
            </Row>
          ))}
      </BoardBorder>
    </BoardContainer>
  );
};

export default Board;
