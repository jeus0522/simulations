import React, { Fragment, useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import { Stack, Container, TextField, Slider, IconButton } from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";
import CircleIcon from "@mui/icons-material/Circle";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import { getSimulationFrames } from "./actions/simulationActions";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiFilledInput-root": {
    fontSize: 11,
  },
  "& .MuiTextField-root": {
    maxHeight: 300,
  },
}));

function App(props) {
  const { actions } = props;
  const [opts, setOpts] = useState({
    pixelsWide: 100,
    pixelsHigh: 100,
    pixelWidth: 10,
    pixelHeight: 10,
    verticalSymmetry: true,
    outputType: "svg",
    msPerFrame: 500,
  });
  const [grid, setGrid] = useState([]);

  const [sliderValue, setSliderValue] = React.useState(1);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [steps, setSteps] = React.useState([]);

  useEffect(() => {
    if (props.steps.length !== 0) {
      setSteps(props.steps);
    }
  }, [props.steps]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (sliderValue === steps.length) {
          setIsPlaying(false);
          clearInterval(interval);
        } else {
          setSliderValue((sliderValue) => sliderValue + 1);
          updateGrid(sliderValue);
        }
      }, opts.msPerFrame);
    } else if (!isPlaying && sliderValue !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sliderValue]);

  const fetchSteps = () => {
    async function fetchData() {
      await actions.getSimulationFrames();
    }
    fetchData();
  };

  const drawSteps = () => {
    generateShit();
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    updateGrid(newValue);
  };

  const updateGrid = (step) => {
    let updatedGrid = [...Array(opts.pixelsWide)].map((e) =>
      Array(opts.pixelsHigh).fill([])
    );
    const actors = steps[step].actors;
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
    updateGrid(1);
  };

  const valuetext = (value) => {
    return `Step ${value}`;
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSliderValue(1);
    updateGrid(1);
  };

  return (
    <React.Fragment>
      {steps.length !== 0 ? (
        <Container maxWidth style={{ backgroundColor: "darkkhaki" }}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={"4px"}
            sx={{ marginTop: "20px" }}
          >
            <div
              style={{
                border: "2px solid lightslategray",
                overflow: "hidden",
                padding: 3,
                borderRadius: 5,
                marginTop: 10,
              }}
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
                        height: 10,
                        display: "flex",
                        backgroundColor: "lightslategray",
                      }}
                    >
                      {cells.map((cell, index) => (
                        <div
                          key={index}
                          style={{
                            height: 10,
                            width: 10,
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
                                fontSize: "5px",
                                color: "wheat",
                                position: "absolute",
                                marginTop: "5px",
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
            <div style={{ width: "40%" }}>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={"4px"}
                sx={{
                  marginTop: "20px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "5px",
                  margin: "10px 0 10px 0",
                  padding: 4,
                }}
              >
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
                  max={steps.length}
                />
                <Stack direction="row" spacing={1}>
                  <IconButton
                    aria-label="Play / Pause"
                    onClick={() => handlePlay()}
                  >
                    {isPlaying ? (
                      <PauseRoundedIcon sx={{ fontSize: 40 }} />
                    ) : (
                      <PlayArrowRoundedIcon sx={{ fontSize: 40 }} />
                    )}
                  </IconButton>
                  <IconButton aria-label="Reset" onClick={() => handleReset()}>
                    <RestartAltRoundedIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </div>
          </Stack>
        </Container>
      ) : null}
      <button onClick={() => fetchSteps()}>fetch</button>
      <button onClick={() => drawSteps()}>draw</button>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  steps: state.simulation.steps,
  isStepsLoading: state.simulation.isStepsLoading,
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        getSimulationFrames,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
