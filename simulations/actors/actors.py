import itertools
from random import choice
from copy import deepcopy

import numpy as np
from dataclasses import dataclass

from simulations.environment import Position, ActorMoves
from simulations.game_entity import BaseId, GameEntity
from simulations.actors.brain import Brain


@dataclass
class Tito:
    reaction_speed: float
    life_expectancy: int

    @classmethod
    def create_random(cls) -> 'Tito':
        reaction_speed = np.random.uniform(0, 1)
        life_expectancy = np.random.uniform(80, 120)
        return Tito(reaction_speed, life_expectancy)


class ActorID(BaseId):
    id_iter = itertools.count()

    @classmethod
    def generate_id(cls):
        """Generate a new ID"""
        idx = f"Tito-{next(ActorID.id_iter)}"
        return ActorID(idx)


class Actor(GameEntity):

    def __init__(self, actor: Tito, idx: ActorID, family: str, brain: Brain):
        self.actor = actor
        self.age = 0
        self.family = family
        self.brain = brain
        super().__init__(idx=idx)

    def __repr__(self):
        return f"{self.idx} , {hex(id(self))}"

    def as_json(self) -> dict:
        actor_json = deepcopy(self.actor.__dict__)
        actor_json.update({"age": self.age, "family": self.family, "id": self.idx.idx})
        return actor_json

    def move(self) -> str:
        return self.random_move()

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
