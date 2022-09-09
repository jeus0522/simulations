import string

import pytest

from simulations.actors.genes import BrainGen, generate_brain_gen, Hexadecimal, generate_brain_genome


@pytest.fixture()
def brain_gen_1() -> BrainGen:
    """BrainGen fixture"""
    return BrainGen('0f', 'f0', 'ff')


@pytest.fixture()
def brain_gen_2() -> BrainGen:
    """BrainGen fixture"""
    return BrainGen("f0", "0f", "00")


def test_genes_random_bit():
    """Test random bit generation"""
    assert len(Hexadecimal.random_bit()) == 1
    assert Hexadecimal.random_bit() in string.hexdigits


def test_genes_random_chain():
    """Test random chain generation"""
    assert len(Hexadecimal.random_chain(2)) == 2
    assert len(Hexadecimal.random_chain(5)) == 5
    for bit in Hexadecimal.random_chain(5):
        assert bit in string.hexdigits


def test_genes_bit_as_binary():
    """Test bit to binary conversion"""
    assert Hexadecimal.bit_as_binary('0') == '0000'
    assert Hexadecimal.bit_as_binary('1') == '0001'
    assert Hexadecimal.bit_as_binary('2') == '0010'
    assert Hexadecimal.bit_as_binary('3') == '0011'
    assert Hexadecimal.bit_as_binary('4') == '0100'
    assert Hexadecimal.bit_as_binary('5') == '0101'
    assert Hexadecimal.bit_as_binary('6') == '0110'
    assert Hexadecimal.bit_as_binary('7') == '0111'
    assert Hexadecimal.bit_as_binary('8') == '1000'
    assert Hexadecimal.bit_as_binary('9') == '1001'
    assert Hexadecimal.bit_as_binary('a') == '1010'
    assert Hexadecimal.bit_as_binary('b') == '1011'
    assert Hexadecimal.bit_as_binary('c') == '1100'
    assert Hexadecimal.bit_as_binary('d') == '1101'
    assert Hexadecimal.bit_as_binary('e') == '1110'
    assert Hexadecimal.bit_as_binary('f') == '1111'
    assert Hexadecimal.bit_as_binary('A') == '1010'
    assert Hexadecimal.bit_as_binary('B') == '1011'
    assert Hexadecimal.bit_as_binary('C') == '1100'
    assert Hexadecimal.bit_as_binary('D') == '1101'
    assert Hexadecimal.bit_as_binary('E') == '1110'
    assert Hexadecimal.bit_as_binary('F') == '1111'


def test_genes_chain_as_binary():
    """Test chain to binary conversion"""
    assert Hexadecimal.chain_as_binary('0') == '0000'
    assert Hexadecimal.chain_as_binary('1') == '0001'
    assert Hexadecimal.chain_as_binary('2') == '0010'
    assert Hexadecimal.chain_as_binary('8') == '1000'
    assert Hexadecimal.chain_as_binary('9') == '1001'
    assert Hexadecimal.chain_as_binary('a') == '1010'
    assert Hexadecimal.chain_as_binary('b') == '1011'
    assert Hexadecimal.chain_as_binary('c') == '1100'
    assert Hexadecimal.chain_as_binary('d') == '1101'
    assert Hexadecimal.chain_as_binary('e') == '1110'
    assert Hexadecimal.chain_as_binary('f') == '1111'
    assert Hexadecimal.chain_as_binary('A') == '1010'
    assert Hexadecimal.chain_as_binary('B') == '1011'
    assert Hexadecimal.chain_as_binary('C') == '1100'
    assert Hexadecimal.chain_as_binary('D') == '1101'
    assert Hexadecimal.chain_as_binary('E') == '1110'
    assert Hexadecimal.chain_as_binary('F') == '1111'
    assert Hexadecimal.chain_as_binary('0f') == '00001111'
    assert Hexadecimal.chain_as_binary('f0') == '11110000'
    assert Hexadecimal.chain_as_binary('ff') == '11111111'
    assert Hexadecimal.chain_as_binary('FF') == '11111111'
    assert Hexadecimal.chain_as_binary('fF') == '11111111'
    assert Hexadecimal.chain_as_binary('Ff') == '11111111'
    assert Hexadecimal.chain_as_binary('0F') == '00001111'


def test_brain_genes(brain_gen_1: BrainGen):
    """Test brain genes"""
    bg = BrainGen(Hexadecimal.random_chain(2), Hexadecimal.random_chain(2), Hexadecimal.random_chain(2))
    assert len(bg.as_str()) == 6

    assert brain_gen_1.as_str() == '0ff0ff'


def test_generate_brain_gen():
    """Test brain gene generation"""
    bg = generate_brain_gen(2)
    assert len(bg.as_str()) == 6

    for bit in bg.as_str():
        assert bit in string.hexdigits


def test_generate_brain_genome():
    """Test brain genome generation"""
    bg_list = generate_brain_genome(2, 2)
    assert len(bg_list) == 2

    for genome in bg_list:
        assert len(genome.as_str()) == 6
        for gen in genome.as_str():
            assert gen in string.hexdigits
