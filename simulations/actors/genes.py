from random import randrange


class Hexadecimal:

    @classmethod
    def random_bit(cls) -> str:
        return hex(randrange(16))[2:]

    @classmethod
    def random_chain(cls, bits: int) -> str:
        chain = ""
        for _ in range(bits):
            chain += cls.random_bit()
        return chain

    @classmethod
    def bit_as_binary(cls, hex_bit: str) -> str:
        assert len(hex_bit) == 1
        binary = bin(int(hex_bit, 16))
        binary_str = binary[2:].zfill(4)
        return binary_str

    @classmethod
    def chain_as_binary(cls, hex_chain: str) -> str:
        binary = ""
        for hex_bit in hex_chain:
            binary += cls.bit_as_binary(hex_bit)
        return binary
