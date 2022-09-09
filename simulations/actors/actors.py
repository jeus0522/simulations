import itertools
from random import choice
from copy import deepcopy

import numpy as np
from dataclasses import dataclass

from simulations.environment import Position, ActorMoves
from simulations.game_entity import BaseIDGenerator, GameEntity
from simulations.actors.brain import Brain


class ActorID(BaseIDGenerator):
    """Generates unique IDs for actors"""
    prefix = "Tito"
    id_iter = itertools.count()


@dataclass
class Tito:
    """Tito is the actor that will be used in the simulation"""
    reaction_speed: float
    life_expectancy: int


class TitoGenerator:
    """Generates Tito instances"""

    @classmethod
    def create_random(cls) -> 'Tito':
        """Creates a random Tito instance"""
        reaction_speed = np.random.uniform(0, 1)
        life_expectancy = np.random.uniform(80, 120)
        return Tito(reaction_speed, life_expectancy)


class Actor(GameEntity):
    """Actor class"""

    def __init__(self, actor: Tito, idx: str, family: str, brain: Brain):
        self.actor = actor
        self.age = 0
        self.family = family
        self.brain = brain
        super().__init__(idx=idx)

    def __repr__(self):
        return f"{self.idx} , {hex(id(self))}"

    def as_json(self) -> dict:
        """Returns a JSON representation of the actor"""
        actor_json = deepcopy(self.actor.__dict__)
        actor_json.update({"age": self.age, "family": self.family, "id": self.idx})
        return actor_json

    def move(self, state_vector: np.array) -> str:

        actions_vector = np.matmul(state_vector, self.brain.weights)

        # All actions are 0
        if not np.any(actions_vector):
            random_action = np.random.randint(0, len(ActorMoves))
            return ActorMoves(random_action).name

        max_action_id = np.argmax(actions_vector)

        return ActorMoves(max_action_id).name

    def increase_age(self):
        self.age += 1

    def has_to_die(self):
        return self.age >= self.actor.life_expectancy

    @staticmethod
    def random_move() -> str:
        actions = [action.name for action in ActorMoves]
        return choice(actions)

    def has_priority(self, other: 'Actor'):
        return self.actor.reaction_speed > other.actor.reaction_speed

    def reproduce(self) -> 'Actor':
        actor = deepcopy(self.actor)
        idx = ActorID.generate_id()
        brain = deepcopy(self.brain)
        return Actor(actor=actor, idx=idx, family=self.family, brain=brain)


@dataclass
class MovingActor:
    last_position: Position
    actor: Actor
    action: str
