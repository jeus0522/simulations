import argparse

from flask import jsonify, Flask

from simulations import Environment


# global
app = Flask(__name__)


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
    env = Environment(10, 10)
    env.populate(2)
    result = {"frame_0": env.export_actors_json()}

    for i in range(5):
        env.step()
        result.update({f"frame_{i + 1}": env.export_actors_json()})

    return result


def main():
    parser = argparse.ArgumentParser()
    # Required arguments
    parser.add_argument('--port', type=int, default=9999, help='Port number where this API should listen.')
    args = parser.parse_args()

    app.run(host='0.0.0.0', port=args.port, debug=True, use_reloader=True)


if __name__ == '__main__':
    main()
