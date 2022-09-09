import numpy as np
import pytest

from simulations.actors.brain import Brain, BrainGenerator
from simulations.actors.genes import BrainGen
from simulations.environment import ActorSensors, ActorMoves


@pytest.fixture()
def brain_fixture(brain_gen_1: BrainGen, brain_gen_2: BrainGen) -> Brain:
    """Brain fixture"""
    return Brain(weights=np.array([[1, 2, 3], [4, 5, 6]]), genome=[brain_gen_1, brain_gen_2])


@pytest.fixture()
def brain_generator_fixture() -> BrainGenerator:
    """Brain generator fixture"""
    return BrainGenerator(sensors=ActorSensors, actions=ActorMoves,
                          num_genes=2, hex_bits=2, weight_limits=5)


def test_brain(brain_fixture):
    assert len(brain_fixture.genome) == 2
    assert brain_fixture.weights.shape == (2, 3)


def test_brain_generator(brain_generator_fixture):
    brain = brain_generator_fixture.generate_brain()
    assert len(brain.genome) == 2
    assert brain.weights.shape == (len(ActorSensors), len(ActorMoves))


def test_brain_generator_decode_option_gen(brain_generator_fixture):
    gen = BrainGen(sensor='00', action='00', weight='00')
    option = brain_generator_fixture.decode_option_gen(gen.sensor, ActorSensors)
    assert option == 0

    gen = BrainGen(sensor='01', action='00', weight='00')
    option = brain_generator_fixture.decode_option_gen(gen.sensor, ActorSensors)
    assert option == 1


def test_brain_generator_decode_float_gen(brain_generator_fixture):
    gen = BrainGen(sensor='00', action='00', weight='00')
    weight = brain_generator_fixture.decode_float_gen(gen.weight, 5)
    assert weight == 0.0

    gen = BrainGen(sensor='00', action='00', weight='01')
    weight = brain_generator_fixture.decode_float_gen(gen.weight, 5)
    assert weight == 0.0390625

    gen = BrainGen(sensor='00', action='00', weight='ff')
    weight = brain_generator_fixture.decode_float_gen(gen.weight, 5)
    assert weight == -4.9609375


def test_brain_generator_decode_gen(brain_generator_fixture):
    gen = BrainGen(sensor='00', action='00', weight='00')
    sensor, action, weight = brain_generator_fixture.decode_gen(gen)
    assert sensor == 0
    assert action == 0
    assert weight == 0.0

    gen = BrainGen(sensor='01', action='01', weight='01')
    sensor, action, weight = brain_generator_fixture.decode_gen(gen)
    assert sensor == 1
    assert action == 1
    assert weight == 0.0390625

    gen = BrainGen(sensor='ff', action='ff', weight='ff')
    sensor, action, weight = brain_generator_fixture.decode_gen(gen)
    assert sensor == 3
    assert action == 0
    assert weight == -4.9609375
