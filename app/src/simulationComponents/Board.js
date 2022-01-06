import React from "react";
import { styled } from "@mui/material/styles";

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

// const Agent = styled("div")((props) => ({
//   margin: "0px auto",
//   height: "60%",
//   width: "60%",
//   backgroundColor: `rgb(67,175,${props.reaction_speed}})`,
//   borderRadius: "50%",
//   marginTop: "20%",
// }));

// const Agent = (props) => {
//   debugger;
//   return (
//     <div
//       sx={{
//         margin: "0px auto",
//         height: "60%",
//         width: "60%",
//         backgroundColor: `rgb(67,175,${props.reaction_speed}})`,
//         borderRadius: "50%",
//         marginTop: "20%",
//       }}
//     >
//       {props.children}
//     </div>
//   );
// };

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
                    <div
                      style={{
                        margin: "0px auto",
                        height: "60%",
                        width: "60%",
                        backgroundColor: `rgb(67,125,${
                          cell[0].actor.actor.reaction_speed * 255
                        })`.toString(),
                        borderRadius: "50%",
                        marginTop: "20%",
                      }}
                    />
                  ) : null}
                  {cell[0] && "food" in cell[0] ? (
                    <div
                      style={{
                        margin: "0px auto",
                        height: "60%",
                        width: "60%",
                        backgroundColor: "crimson",
                        borderRadius: "50%",
                        marginTop: "20%",
                      }}
                    />
                  ) : null}
                </Cell>
              ))}
            </Row>
          ))}
      </BoardBorder>
    </BoardContainer>
  );
};

export default Board;
