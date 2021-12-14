from typing import Tuple, Dict, List
from random import randrange, choice

from dataclasses import dataclass

from simulations.actors import Tito
from simulations.utils import Constants


@dataclass
class ActorMoves(Constants):
    MOVE_UP = "up"
    MOVE_RIGHT = "right"
    MOVE_DOWN = "down"
    MOVE_LEFT = "left"
    STAY = "stay"


class EnvironmentPosition(object):
    """Stores an object position in a 2D environment, in units"""

    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash(self.__repr__())

    def __repr__(self):
        return f"CellPosition( x = {self.x}, y = {self.y} )"

    def as_tuple(self) -> Tuple[int, int]:
        return self.x, self.y

    @classmethod
    def from_tuple(cls, position: Tuple[int, int]):
        return cls(*position)


class EnvironmentActor:

    def __init__(self, actor: Tito):
        self.actor = actor

    def __repr__(self):
        return self.actor.__repr__()

    def move(self) -> str:
        return self.random_move()

    @staticmethod
    def random_move() -> str:
        return choice(ActorMoves.values_as_list())

    def has_priority(self, other: 'EnvironmentActor'):
        return self.actor.reaction_speed > other.actor.reaction_speed


@dataclass
class MovingActor:
    last_position: EnvironmentPosition
    actor: EnvironmentActor
    action: str


class Environment:

    def __init__(self, width: int, height: int):

        self.width = width
        self.height = height
        self.actors: Dict[EnvironmentPosition, EnvironmentActor] = {}

    def calculate_actor_move(self, position: EnvironmentPosition, action_name: str):

        new_x = position.x
        new_y = position.y
        if action_name == ActorMoves.MOVE_UP:
            if position.y < self.height - 1:
                new_y += 1
        elif action_name == ActorMoves.MOVE_DOWN:
            if position.y > 0:
                new_y -= 1
        elif action_name == ActorMoves.MOVE_RIGHT:
            if position.x < self.width - 1:
                new_x += 1
        elif action_name == ActorMoves.MOVE_LEFT:
            if position.x > 0:
                new_x -= 1
        elif action_name == ActorMoves.STAY:
            pass
        else:
            raise ValueError(f"Actor move {action_name} not recognized.")

        return EnvironmentPosition(new_x, new_y)

    def add_actor(self, actor: EnvironmentActor, position: EnvironmentPosition):
        """Adds an actor to the environment in the specified position"""
        self.actors.update({position: actor})

    def is_position_available(self, position: EnvironmentPosition) -> bool:
        """Checks if a position is available in the environment"""
        return position not in self.actors

    def generate_random_position(self) -> EnvironmentPosition:
        """Generates an available position in the environment"""
        while True:
            position = EnvironmentPosition(randrange(self.width), randrange(self.height))
            if self.is_position_available(position):
                break

        return position

    def populate(self, num_actors: int):
        """Populates the environment with random actors in random positions"""
        for _ in range(num_actors):
            position = self.generate_random_position()
            actor = EnvironmentActor(Tito.create_random())
            self.add_actor(actor=actor, position=position)

    def generate_actor_moves(self) -> List[MovingActor]:
        """Generates a list of moving actors with the actors in the environment"""
        moving_actors_list: List[MovingActor] = []
        for position, actor in self.actors.items():
            action = actor.move()
            moving_actors_list.append(MovingActor(actor=actor, last_position=position, action=action))
        return moving_actors_list

    def apply_actor_moves(self, actor_moves: List[MovingActor]) -> Dict[EnvironmentPosition, EnvironmentActor]:
        """Generates a new dictionary of positions and their actors, based on the passed moves and actors"""

        moving_actors: Dict[EnvironmentPosition, MovingActor] = {}
        final_positions: Dict[EnvironmentPosition, EnvironmentActor] = {}
        for moving_actor in actor_moves:

            if moving_actor.action == ActorMoves.STAY:
                final_positions.update({moving_actor.last_position: moving_actor.actor})
                continue

            next_position = self.calculate_actor_move(moving_actor.last_position, moving_actor.action)
            if not self.is_position_available(next_position):
                final_positions.update({moving_actor.last_position: moving_actor.actor})
                continue

            if next_position not in moving_actors:
                moving_actors.update({next_position: moving_actor})
                continue

            contestant_actor = moving_actors.get(next_position)

            if moving_actor.actor.has_priority(contestant_actor.actor):
                final_positions.update({contestant_actor.last_position: contestant_actor.actor})
                moving_actors.update({next_position: moving_actor})
            else:
                final_positions.update({moving_actor.last_position: moving_actor.actor})

        for next_position, moving_actor in moving_actors.items():
            final_positions.update({next_position: moving_actor.actor})

        return final_positions

    def step(self):
        actor_moves = self.generate_actor_moves()
        self.actors = self.apply_actor_moves(actor_moves)

    def export_actors_json(self) -> Dict:
        actors_states: List[Dict] = []
        for position, environment_actor in self.actors.items():
            actor_state = {"x": position.x,
                           "y": position.y,
                           "reaction_speed": environment_actor.actor.reaction_speed}
            actors_states.append(actor_state)

        return {"actors": actors_states}


def main():
    env = Environment(10, 10)
    env.populate(2)

    print(env.actors)
    for _ in range(5):
        env.step()

        print(env.actors)


if __name__ == '__main__':
    main()
