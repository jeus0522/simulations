import "./App.css";
import React, { Fragment, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Stack, Container, TextField, Slider } from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";
import CircleIcon from "@mui/icons-material/Circle";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiFilledInput-root": {
    fontSize: 11,
  },
  "& .MuiTextField-root": {
    maxHeight: 300,
  },
}));

function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === "object";
}

function App() {
  const steps = [
    {
      actors: [
        {
          reaction_speed: -1.6804522056140185,
          x: 7,
          y: 6,
        },
        {
          reaction_speed: -0.21113376937868522,
          x: 9,
          y: 7,
        },
      ],
    },
    {
      actors: [
        {
          reaction_speed: -1.6804522056140185,
          x: 7,
          y: 7,
        },
        {
          reaction_speed: -0.21113376937868522,
          x: 9,
          y: 8,
        },
      ],
    },
    {
      actors: [
        {
          reaction_speed: -1.6804522056140185,
          x: 7,
          y: 7,
        },
        {
          reaction_speed: -0.21113376937868522,
          x: 9,
          y: 8,
        },
      ],
    },
    {
      actors: [
        {
          reaction_speed: -0.21113376937868522,
          x: 9,
          y: 8,
        },
        {
          reaction_speed: -1.6804522056140185,
          x: 6,
          y: 7,
        },
      ],
    },
    {
      actors: [
        {
          reaction_speed: -0.21113376937868522,
          x: 9,
          y: 8,
        },
        {
          reaction_speed: -1.6804522056140185,
          x: 7,
          y: 7,
        },
      ],
    },
    {
      actors: [
        {
          reaction_speed: -0.21113376937868522,
          x: 9,
          y: 8,
        },
        {
          reaction_speed: -1.6804522056140185,
          x: 6,
          y: 7,
        },
      ],
    },
  ];

  const [opts, setOpts] = useState({
    pixelsWide: 10,
    pixelsHigh: 10,
    pixelWidth: 10,
    pixelHeight: 10,
    verticalSymmetry: true,
    outputType: "svg",
  });
  const [grid, setGrid] = useState([]);

  const [sliderValue, setSliderValue] = React.useState(1);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    updateGrid();
  };

  useEffect(() => {
    generateShit();
  }, []);

  const updateGrid = () => {
    let updatedGrid = [...Array(opts.pixelsWide)].map((e) =>
      Array(opts.pixelsHigh).fill([])
    );
    const actors = steps[sliderValue].actors;
    actors.map((actor) => {
      updatedGrid[actor.x][actor.y] = [{ actor }];
    });

    setGrid(updatedGrid);
  };

  const generateShit = () => {
    const grid = [...Array(opts.pixelsWide)].map((e) =>
      Array(opts.pixelsHigh).fill([])
    );
    setGrid(grid);
    updateGrid();
  };

  const valuetext = (value) => {
    return `Step ${value}`;
  };

  console.log(grid);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth style={{ marginTop: 20, backgroundColor: "unset" }}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={"4px"}
        >
          <div
            style={{
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            {grid.length > 0 &&
              grid.map((cells, index) => (
                <div
                  key={index}
                  style={{
                    height: 40,
                    display: "flex",
                    backgroundColor: "lightslategray",
                  }}
                >
                  {cells.map((cell, index) => (
                    <div
                      key={index}
                      style={{
                        height: 40,
                        width: 40,
                        backgroundColor: "lightslategray",
                        marginLeft: 2,
                        marginRight: 2,
                        display: "table-cell",
                        verticalAlign: "middle",
                      }}
                    >
                      {cell.length > 0 && (
                        <CircleIcon
                          sx={{
                            fontSize: 30,
                            marginTop: "15%",
                            color: "wheat",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>
          <div style={{ width: "50%" }}>
            <Slider
              aria-label="Steps"
              defaultValue={1}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              value={typeof sliderValue === "number" ? sliderValue : 0}
              onChange={handleSliderChange}
              step={1}
              marks
              min={1}
              max={steps.length - 1}
            />
          </div>
        </Stack>
      </Container>
    </React.Fragment>
  );
}

export default App;
