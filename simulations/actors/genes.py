import string
from random import choice
from typing import List


class Hexadecimal:
    """Hexadecimal operations"""

    @classmethod
    def random_bit(cls) -> str:
        """Generate a random bit of a hexadecimal number"""
        return choice(string.hexdigits)

    @classmethod
    def random_chain(cls, bits: int) -> str:
        """Generate a random hexadecimal number of the required length"""
        chain = ""
        for _ in range(bits):
            chain += cls.random_bit()
        return chain

    @classmethod
    def bit_as_binary(cls, hex_bit: str) -> str:
        """Convert a hexadecimal bit to a binary string"""
        assert len(hex_bit) == 1
        binary = bin(int(hex_bit, 16))
        binary_str = binary[2:].zfill(4)
        return binary_str

    @classmethod
    def chain_as_binary(cls, hex_chain: str) -> str:
        """Convert a hexadecimal number to a binary string"""
        binary = ""
        for hex_bit in hex_chain:
            binary += cls.bit_as_binary(hex_bit)
        return binary


class BrainGen:

    def __init__(self, sensor: str, action: str, weight: str):
        """Represents a brain gen. Each parameter is a hexadecimal number."""
        self.sensor = sensor
        self.action = action
        self.weight = weight

    def __repr__(self):
        return f"BrainGenome({self.as_str()})"

    def as_str(self):
        """Return a string representation of the brain gen"""
        return f"{self.sensor}{self.action}{self.weight}"


def generate_brain_gen(hex_bits: int = 2) -> BrainGen:
    """Generate random brain genomes with parts of the required length"""
    return BrainGen(sensor=Hexadecimal.random_chain(hex_bits),
                    action=Hexadecimal.random_chain(hex_bits),
                    weight=Hexadecimal.random_chain(hex_bits))


def generate_brain_genome(num_genes: int, hex_bits: int = 2) -> List[BrainGen]:
    """Generate a brain genome with the required number of genes"""
    return [generate_brain_gen(hex_bits) for _ in range(num_genes)]
