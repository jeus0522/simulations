import React, { Fragment, useState, useEffect } from "react";
import { io } from "socket.io-client";

import "./simulation.css";

function Square(props) {
  return (
    <div className="square-container">
      {props.value === "actor" && (
        <svg viewBox="0 0 24 24">
          <g fill="#1a237e">
            <circle cx="12" cy="4" r="2"></circle>
            <path d="M15.89 8.11C15.5 7.72 14.83 7 13.53 7h-2.54C8.24 6.99 6 4.75 6 2H4c0 3.16 2.11 5.84 5 6.71V22h2v-6h2v6h2V10.05L18.95 14l1.41-1.41-4.47-4.48z" />
          </g>
        </svg>
      )}
      {props.value === "food" && (
        <div style={{ width: 20, height: 20, paddingTop: 10 }}>
          <svg viewBox="0 0 24 24 ">
            <g fill="#ff6d00">
              <path d="M22 10c.32-3.28-4.28-6-9.99-6S1.7 6.72 2.02 10H22zM5.35 13.5c.55 0 .78.14 1.15.36.45.27 1.07.64 2.18.64s1.73-.37 2.18-.64c.37-.23.59-.36 1.15-.36.55 0 .78.14 1.15.36.45.27 1.07.64 2.18.64s1.73-.37 2.18-.64c.37-.23.59-.36 1.15-.36.55 0 .78.14 1.15.36.45.27 1.07.63 2.17.64v-1.98s-.79-.16-1.16-.38c-.45-.27-1.07-.64-2.18-.64s-1.73.37-2.18.64c-.37.23-.6.36-1.15.36s-.78-.14-1.15-.36c-.45-.27-1.07-.64-2.18-.64s-1.73.37-2.18.64c-.37.23-.59.36-1.15.36-.55 0-.78-.14-1.15-.36-.45-.27-1.07-.64-2.18-.64s-1.73.37-2.18.64c-.37.23-.59.36-1.15.36v2c1.11 0 1.73-.37 2.21-.64.37-.23.59-.36 1.14-.36zM2 16v2c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2H2z" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}

function Row(props) {
  var squares = [];
  for (var i = 0; i < props.elements.length; i++) {
    squares.push(Square({ value: props.elements[i], key: i }));
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>{squares}</div>
  );
}

function Board(props) {
  var rows = [];
  for (var i = 0; i < props.board.length; i++) {
    rows.push(Row({ elements: props.board[i], key: i }));
  }

  return <div className="board-container">{rows}</div>;
}

function Pause(props) {
  return (
    <button className="button-52" onClick={props.onClick}>
      Pause
    </button>
  );
}

function Play(props) {
  return (
    <button className="button-52" onClick={props.onClick}>
      Play
    </button>
  );
}

function Step(props) {
  return (
    <button className="button-52" onClick={props.onClick}>
      Step
    </button>
  );
}

function SimulationPage() {
  const [board, setBoard] = useState([]);
  const [socketInstance, setSocketInstance] = useState({});

  const nextStep = () => {
    fetch("/step_simulation")
      .then((response) => response.json())
      .then((data) => {
        setBoard(data.frame);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (board.length === 0) {
      fetch("/start_simulation", {
        methods: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setBoard(data.frame))
        .catch((error) => console.log(error));
    }

    const socket = io("localhost:9999/", {
      cors: {
        origin: "http://localhost:3000/",
      },
    });

    setSocketInstance(socket);

    socket.on("connect", (data) => {
      console.log(data);
    });

    socket.on("simulation_state", (data) => {
      setBoard(data.frame);
    });

    socket.on("disconnect", (data) => {
      console.log(data);
    });
  }, []);

  const startSimulation = () => {
    socketInstance.emit("run_simulation");
  };

  const stopSimulation = () => {
    socketInstance.emit("stop_simulation");
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          borderBottom: "solid 4px #d7ccc8",
        }}
      >
        <h1>Simulations</h1>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          margin: "40px 0",
        }}
      >
        <div>
          <Board board={board} />
        </div>
        <div
          style={{
            width: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px",
          }}
        >
          <Play onClick={startSimulation} />
          <Pause onClick={stopSimulation} />
          <Step onClick={nextStep} />
        </div>
      </div>
    </div>
  );
}

export default SimulationPage;
