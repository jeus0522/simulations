from enum import Enum
from typing import List

import numpy as np

from simulations.actors.genes import Hexadecimal


class BrainGen:

    def __init__(self, sensor: str, action: str, weight: str):
        """Represents a brain gen. Each parameter is a hexadecimal number."""
        self.sensor = sensor
        self.action = action
        self.weight = weight

    def __repr__(self):
        return f"BrainGenome({self.as_str()})"

    def as_str(self):
        return f"{self.sensor}{self.action}{self.weight}"


def generate_brain_gen(hex_bits: int = 2) -> BrainGen:
    """Generate brain genomes with parts of the required length"""
    return BrainGen(sensor=Hexadecimal.random_chain(hex_bits),
                    action=Hexadecimal.random_chain(hex_bits),
                    weight=Hexadecimal.random_chain(hex_bits))


def generate_brain_genome(num_genes: int, hex_bits: int = 2) -> List[BrainGen]:
    return [generate_brain_gen(hex_bits) for _ in range(num_genes)]


class Brain:

    def __init__(self, weights: np.array, genome: List[BrainGen]):
        self.weights = weights
        self.genome = genome


class BrainGenerator:

    def __init__(self, sensors: Enum, actions: Enum, num_genes: int,
                 hex_bits: int = 2, weight_limits: int = 5):
        self.sensors = sensors
        self.actions = actions
        self.num_genes = num_genes
        self.hex_bits = hex_bits
        self.weight_limits = weight_limits

    def decode_gen(self, gen: BrainGen) -> (int, int, float):
        sensor = int(gen.sensor, 16) % len(self.sensors)
        action = int(gen.action, 16) % len(self.actions)
        binary_weight_gen = Hexadecimal.chain_as_binary(gen.weight)
        weight_sing = -1 if int(binary_weight_gen[0]) else 1
        weight_binary_value = binary_weight_gen[1:]

        max_number = 2 ** len(weight_binary_value)
        weight_value = int(weight_binary_value, 2)
        final_weight = (weight_value / max_number) * self.weight_limits * weight_sing

        return sensor, action, final_weight

    def generate_brain(self) -> Brain:
        weights = np.zeros((len(self.sensors), len(self.actions)))
        genome = generate_brain_genome(self.num_genes, self.hex_bits)

        for brain_gen in genome:
            sensor, action, final_weight = self.decode_gen(brain_gen)
            weights[sensor][action] = final_weight
        
        return Brain(weights, genome)


def main():
    from simulations.environment import ActorMoves, ActorSensors

    bg = BrainGenerator(ActorSensors, ActorMoves, 3, 2, 5)
    b = bg.generate_brain()
    print(b.weights)


if __name__ == '__main__':
    main()
