from random import choice

import numpy as np
from dataclasses import dataclass

from simulations.utils import Constants


@dataclass
class Tito:
    reaction_speed: float
    life_expectancy: int

    @classmethod
    def create_random(cls) -> 'Tito':
        reaction_speed = np.random.uniform(0, 1)
        life_expectancy = np.random.uniform(80, 120)
        return Tito(reaction_speed, life_expectancy)


@dataclass
class ActorMoves(Constants):
    MOVE_UP = "up"
    MOVE_RIGHT = "right"
    MOVE_DOWN = "down"
    MOVE_LEFT = "left"
    STAY = "stay"


class Actor:

    def __init__(self, actor: Tito):
        self.actor = actor
        self.age = 0

    def __repr__(self):
        return f"{self.actor.__repr__()} , age={self.age}"

    def move(self) -> str:
        return self.random_move()

    def increase_age(self):
        self.age += 1

    def has_to_die(self):
        return self.age >= self.actor.life_expectancy

    @staticmethod
    def random_move() -> str:
        return choice(ActorMoves.values_as_list())

    def has_priority(self, other: 'Actor'):
        return self.actor.reaction_speed > other.actor.reaction_speed
