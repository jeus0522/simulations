import React, { useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import { Stack, Container } from "@mui/material";

import Board from "./simulationComponents/Board";
import Controls from "./simulationComponents/Controls";

import { getSimulationFrames } from "./actions/simulationActions";

const AppContainer = styled(Container)(({ theme }) => ({
  backgroundColor: "darkkhaki",
}));

function App(props) {
  const { actions, steps } = props;
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
  //const [steps, setSteps] = React.useState([]);

  useEffect(() => {
    fetchSteps();
  }, []);

  useEffect(() => {
    if (props.steps.length !== 0) {
      drawSteps();
    }
  }, [props.steps]);

  //setTimeout(drawSteps(), 2500);

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
      updatedGrid[actor.x][actor.y] = [{ actor: { actor } }];
    });

    const foods = steps[step].food;
    foods.map((food) => {
      updatedGrid[food.x][food.y] = [{ food: { food } }];
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
        <AppContainer maxWidth>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={"4px"}
            sx={{ marginTop: "20px" }}
          >
            <Board grid={grid} />
            <Controls
              steps={steps}
              valuetext={valuetext}
              handleSliderChange={handleSliderChange}
              handlePlay={handlePlay}
              handleReset={handleReset}
              sliderValue={sliderValue}
              isPlaying={isPlaying}
            />
          </Stack>
        </AppContainer>
      ) : null}
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
