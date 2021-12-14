import "./App.css";
import { getSprite, outputSprite } from "svg-invader-gen";
import React, { Fragment, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Container,
  Grid,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import CssBaseline from "@mui/material/CssBaseline";

import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import SaveIcon from "@mui/icons-material/Save";
import UpdateIcon from "@mui/icons-material/Update";
import AddIcon from "@mui/icons-material/Add";

import { storedTemplates } from "./templates";

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
  const [svgTemplates, setSvgTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [amount, setAmount] = useState(1);
  const [opts, setOpts] = useState({
    pixelsWide: 10,
    pixelsHigh: 10,
    pixelWidth: 10,
    pixelHeight: 10,
    verticalSymmetry: true,
    outputType: "svg",
  });

  const [internal, setInternal] = useState({
    researchMode: true,
    fullRandom: false,
    storedTemplates: storedTemplates,
    selectedTemplate: "",
  });

  const updateName = (index) => {
    const nameTextfield = document.getElementById(`set-name${index}`);
    const updatedSvgTemplates = [...svgTemplates];
    updatedSvgTemplates[index].name = nameTextfield.value;
    setSvgTemplates(updatedSvgTemplates);
    nameTextfield.value = "";
  };

  const addAttribute = (index) => {
    const attrNameTextfield = document.getElementById(`attr-name${index}`);
    const attrValueTextfield = document.getElementById(`attr-value${index}`);
    const updatedSvgTemplates = [...svgTemplates];
    let obj = {};
    if (attrNameTextfield.value.length === 0) {
      obj = {
        value: attrValueTextfield.value,
      };
    } else {
      obj = {
        trait_type: attrNameTextfield.value,
        value: attrValueTextfield.value,
      };
    }
    updatedSvgTemplates[index].svgProperties.attributes.push(obj);
    setSvgTemplates(updatedSvgTemplates);
    attrNameTextfield.value = "";
    attrValueTextfield.value = "";
  };

  const handleChange = (prop) => (event) => {
    if (event.target.type === "checkbox") {
      setOpts({ ...opts, [prop]: event.target.checked });
    } else {
      setOpts({ ...opts, [prop]: event.target.value });
    }
  };

  const handleChangeInternal = (prop) => (event) => {
    if (event.target.type === "checkbox") {
      setInternal({ ...internal, [prop]: event.target.checked });
    } else {
      setInternal({ ...internal, [prop]: event.target.value });
    }
  };

  const handleChangeSelectedTemplate = (event) => {
    setSelectedTemplate(event.target.value);
  };

  const saveFile = (svg, fileNumber) => {
    const element = document.createElement("a");
    const file = new Blob([svg], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `generatedSVG/middleEarthResearch - ${fileNumber}.svg`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    element.remove();
  };

  const saveTemplate = (template) => {
    //localStorage.setItem('templates',[])
    const emptyshit = [];
    let templates = localStorage.getItem("templates");
    if (templates === null || templates === "") {
      localStorage.setItem("templates", JSON.stringify(emptyshit));
      templates = JSON.parse(localStorage.getItem("templates"));
    } else {
      templates = JSON.parse(localStorage.getItem("templates"));
    }
    templates.push(template);
    localStorage.setItem("templates", JSON.stringify(templates));
  };

  const parseSprite = (sprite, paletteColors) => {
    const parsedSprite = sprite.map((row) => {
      const parsedRow = [];
      row.map((cell) => {
        if (deepEqual(cell, { red: 0, green: 0, blue: 0 }) === true) {
          parsedRow.push("black");
        }
        if (deepEqual(cell, { red: 255, green: 255, blue: 255 }) === true) {
          parsedRow.push("white");
        }
        if (deepEqual(cell, paletteColors.color1) === true) {
          parsedRow.push("color1");
        }
        if (deepEqual(cell, paletteColors.color2) === true) {
          parsedRow.push("color2");
        }
      });
      return parsedRow;
    });
    return parsedSprite;
  };

  const generateShit = () => {
    const svgTemps = [];
    setSvgTemplates([]);
    setGenerating(true);
    for (let index = 0; index < amount; index++) {
      const getSpriteResult = getSprite(opts);
      const sprite = getSpriteResult.sprite;
      const paletteColors = getSpriteResult.paletteColors;
      const svg = outputSprite(opts, sprite);

      for (let indexX = 0; indexX < opts.pixelsWide; indexX++) {
        for (let indexY = 0; indexY < opts.pixelsHigh; indexY++) {
          //aca muestro el agente en la posicion
        }
      }

      const svgPropsObject = {
        description: "",
        external_url: "",
        image: "",
        name: `middleEarthResearch - ${index}.svg`,
        attributes: [
          {
            trait_type: "Primary Color",
            value: `RGB(${paletteColors.color1.red},${paletteColors.color1.green},${paletteColors.color1.blue})`,
          },
          {
            trait_type: "Secondary Color",
            value: `RGB(${paletteColors.color2.red},${paletteColors.color2.green},${paletteColors.color2.blue})`,
          },
        ],
      };

      const parsedSprite = parseSprite(sprite, paletteColors);
      const finalTemplate = {
        name: "",
        svgProperties: svgPropsObject,
        svgSprite: parsedSprite,
        originalPalette: paletteColors,
        originalSvg: svg,
      };
      svgTemps.push(finalTemplate);

      if (internal.researchMode === false) {
        saveFile(svg, index);
      }
    }

    setSvgTemplates(svgTemps);
    setGenerating(false);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: "#cfe8fc", height: "100vh" }}>fsdfsd</Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
