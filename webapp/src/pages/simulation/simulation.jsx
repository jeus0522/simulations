import React, {Fragment, useState, useEffect} from 'react';
import { io } from "socket.io-client";

import "./simulation.css";


function Square(props) {
    return (
        <button className={`square ${props.value}`}>
        
        </button>
    );
}


function Row(props) {

    var squares = [];
    for (var i = 0; i < props.elements.length; i++) {
        squares.push(Square({value: props.elements[i], key: i}));
    }

    return (
        <div className="board-row">
            {squares}
        </div>
    );
}


function Board(props) {
   
    var rows = [];
    for (var i = 0; i < props.board.length; i++) {
        rows.push(Row({elements: props.board[i], key: i}));
    }

    return (
        <div>
            {rows}
        </div>
    );
}


function Pause (props) {
    return (
        <button className='button pause' onClick={props.onClick}>Pause</button>
    )
}

function Play (props) {
    return (
        <button className='button play' onClick={props.onClick}>Play</button>
    )
}


function Step (props) {
    return (
        <button className='button step' onClick={props.onClick}>Step</button>
    )
}


function SimulationPage() {

    const [board, setBoard] = useState([]);
    const [socketInstance, setSocketInstance] = useState({});

    const nextStep = () => {
        fetch('/step_simulation')
        .then(response => response.json())
        .then(data => {
            setBoard(data.frame);
        })
        .catch(error => console.log(error));
    };

    useEffect(() => {
        if (board.length === 0) {
            fetch('/start_simulation',{
                'methods':'GET',
                headers : {
                    'Content-Type':'application/json'
                }
            })
            .then(res => res.json())
            .then(data => setBoard(data.frame))
            .catch(error => console.log(error));
        };

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

    },[]);

    const startSimulation = () => {
        socketInstance.emit("run_simulation");
    };

    const stopSimulation = () => {
        socketInstance.emit("stop_simulation");
    };
        

    return (
        <Fragment>
            <h1>Simulations</h1>
            <Pause onClick={stopSimulation}/>
            <Play onClick={startSimulation}/>
            <Step onClick={nextStep}/>
            <Board board={board}/>
        </Fragment>

    );
}

export default SimulationPage;