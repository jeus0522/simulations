import argparse
from typing import Optional

from flask import jsonify, Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from simulations import SimulationEngine

# global
app = Flask(__name__)
app.secret_key = '!super1 secret2 key3'
app.config["simulation_engine"]: Optional[SimulationEngine] = None
app.config["running_simulation"] = False

CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    sid = getattr(request, "sid", None)
    print(f"client {sid} has connected")
    emit("connect", {"data": f"id: {sid} is connected"})


@socketio.on('run_simulation')
def run_simulation():
    """event listener when client starts the simulation"""
    print("starting simulation socket")

    if not app.config["running_simulation"]:
        app.config["running_simulation"] = True
        while app.config["running_simulation"]:
            socketio.sleep(0.05)
            app.config["simulation_engine"].step()
            emit("simulation_state", get_simulation_state())


@socketio.on("stop_simulation")
def stop_simulation():
    """event listener when client stops the simulation"""
    print("stopping simulation socket")
    app.config["running_simulation"] = False


@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")


@app.errorhandler(500)
def internal_error():
    return "Oops, apologies! We encountered a problem. Please try again later.", 500


@app.route('/heartbeat', methods=['GET'])
@app.route('/support/heartbeat', methods=['GET'])
def heartbeat():
    return 'ok'


@app.route('/get_simulation_frames', methods=['GET', 'POST'])
def api_get_simulation_frames():
    result = get_simulation_frames()
    return jsonify(result), 200


def get_simulation_frames() -> dict:
    engine = SimulationEngine(width=100, height=100, num_food=160)
    engine.initialize_simulation(num_actors=200)
    result = [engine.export_state_json()]

    for i in range(100):
        engine.step()
        result.append(engine.export_state_json())

    return result


def get_simulation_state() -> dict:
    result = app.config["simulation_engine"].export_board_json().tolist()
    return {"frame": result}


@app.route('/get_simulation_state', methods=['GET'])
def api_get_simulation_state():
    if app.config["simulation_engine"] is None:
        return jsonify({"error": "Simulation not started"}), 500
    result = get_simulation_state()
    return jsonify(result), 200


@app.route('/start_simulation', methods=['GET'])
def start_simulation():
    app.config["simulation_engine"] = SimulationEngine(width=20, height=20, num_food=20)
    app.config["simulation_engine"].initialize_simulation(num_actors=25)
    return jsonify(get_simulation_state()), 200


@app.route('/step_simulation', methods=['GET'])
def step_simulation():
    if app.config["simulation_engine"] is None:
        return jsonify({"error": "Simulation not started"}), 500
    app.config["simulation_engine"].step()
    return jsonify(get_simulation_state()), 200


def main():
    parser = argparse.ArgumentParser()
    # Required arguments
    parser.add_argument('--port', type=int, default=9999, help='Port number where this API should listen.')
    args = parser.parse_args()

    socketio.run(app, host='0.0.0.0', debug=False, port=args.port, allow_unsafe_werkzeug=True)


if __name__ == '__main__':
    main()
