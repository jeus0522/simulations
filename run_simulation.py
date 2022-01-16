from simulations import SimulationEngine
import time


def main():

    engine = SimulationEngine(width=100, height=100, num_food=160)
    engine.initialize_simulation(num_actors=200)

    start_time = time.time()
    for _ in range(1_000):
        engine.step()

    print(time.time() - start_time)


if __name__ == '__main__':
    main()
