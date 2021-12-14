from abc import ABC, abstractmethod
import numpy as np


# class Actor(ABC):
#
#     @abstractmethod
#     def perform_action(self) -> str:
#         """Executes the action the agent wants to do."""


class Tito:

    def __init__(self, reaction_speed: float):
        self.reaction_speed = reaction_speed

    def __repr__(self):
        return f"Tito( reaction_speed = {self.reaction_speed} )"

    @classmethod
    def create_random(cls) -> 'Tito':
        reaction_speed = np.random.normal(0, 1)
        return Tito(reaction_speed=reaction_speed)
