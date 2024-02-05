from dataclasses import dataclass
from enum import Enum
from typing import List, Type

import numpy as np

from simulations.actors.genes import Hexadecimal, generate_brain_genome, BrainGen


@dataclass(frozen=True)
class Brain:
    """Represents a brain of an actor"""
    weights: np.array
    genome: List[BrainGen]

    def __repr__(self):
        return f"{self.genome})"


class BrainGenerator:
    """Generator for brain objects"""

    def __init__(self, sensors: Type[Enum], actions: Type[Enum], num_genes: int,
                 hex_bits: int = 2, weight_limits: int = 5):
        self.sensors = sensors
        self.actions = actions
        self.num_genes = num_genes
        self.hex_bits = hex_bits
        self.weight_limits = weight_limits

    @staticmethod
    def decode_option_gen(gen: str, options: Type[Enum]) -> int:
        """Decode a brain gen into a specific choice from a list of options"""
        option = int(gen, 16) % len(options)
        return option

    @staticmethod
    def decode_float_gen(gen: str, weight_limits: int) -> float:
        """Decode a brain gen into a float"""
        binary_weight_gen = Hexadecimal.chain_as_binary(gen)
        weight_sing = -1 if int(binary_weight_gen[0]) else 1
        weight_binary_value = binary_weight_gen[1:]

        max_number = 2 ** len(weight_binary_value)
        weight_value = int(weight_binary_value, 2)
        final_weight = (weight_value / max_number) * weight_limits * weight_sing

        return final_weight

    def decode_gen(self, gen: BrainGen) -> (int, int, float):
        """Decode a brain gen into a sensor, action and weight"""
        sensor = self.decode_option_gen(gen.sensor, self.sensors)
        action = self.decode_option_gen(gen.action, self.actions)
        final_weight = self.decode_float_gen(gen.weight, self.weight_limits)

        return sensor, action, final_weight

    def generate_brain(self) -> Brain:
        """Generate a brain with a random genome"""
        weights = np.zeros((len(self.sensors), len(self.actions)))
        genome = generate_brain_genome(self.num_genes, self.hex_bits)

        for brain_gen in genome:
            sensor, action, final_weight = self.decode_gen(brain_gen)
            weights[sensor][action] = final_weight
        
        return Brain(weights, genome)
