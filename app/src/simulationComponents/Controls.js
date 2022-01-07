import React from "react";
import { styled } from "@mui/material/styles";
import { Stack, Slider, IconButton } from "@mui/material";

import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

const ControlsContainer = styled("div")(() => ({
  width: "40%",
}));

const Controls = (props) => {
  const {
    steps,
    valuetext,
    handleSliderChange,
    handlePlay,
    handleReset,
    isPlaying,
    sliderValue,
  } = props;

  return (
    <ControlsContainer>
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
          <IconButton aria-label="Play / Pause" onClick={() => handlePlay()}>
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
    </ControlsContainer>
  );
};

export default Controls;
