from abc import ABC, abstractmethod

import itertools


import numpy as np


# class Actor(ABC):
#
#     @abstractmethod
#     def perform_action(self) -> str:
#         """Executes the action the agent wants to do."""


class Tito:
    id_iter = itertools.count()

    def __init__(self, reaction_speed: float, life_expectancy: int):
        self.id = f"Tito-{next(Tito.id_iter)}"
        self.reaction_speed = reaction_speed
        self.life_expectancy = life_expectancy

    def __repr__(self):
        return f"( id: {self.id} , reaction_speed = {self.reaction_speed} , life_expectancy = {self.life_expectancy})"

    @classmethod
    def create_random(cls) -> 'Tito':
        reaction_speed = np.random.uniform(0, 1)
        life_expectancy = np.random.uniform(80, 120)
        return Tito(reaction_speed=reaction_speed, life_expectancy=life_expectancy)
