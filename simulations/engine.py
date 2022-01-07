from random import randrange
from typing import Dict, List

from simulations.actors import ActorMoves, Actor
from simulations.actors import MovingActor
from simulations.environment import Environment, Position
from simulations.food import Food


class ActorsManager:

    def __init__(self):
        self.actors: Dict[Position, Actor] = {}

    def add_actor(self, actor: Actor, position: Position):
        """Adds an actor to the environment in the specified position"""
        self.actors.update({position: actor})

    def remove_actor(self, position: Position):
        """Removes actor from the specified position"""
        self.actors.pop(position)

    def has_actor(self, position: Position):
        """Return true if there is an actor in the position"""
        return position in self.actors

    def items(self):
        """Iterates over all actors and give a tuple (position, actor) for each"""
        return self.actors.items()

    def generate_actor_moves(self) -> List[MovingActor]:
        """Generates a list of moving actors with the actors in the environment"""
        moving_actors_list: List[MovingActor] = []
        for position, actor in self.actors.items():
            action = actor.move()
            moving_actors_list.append(MovingActor(actor=actor, last_position=position, action=action))
        return moving_actors_list

    def get_moving_actors(self, env: Environment) -> Dict[Position, MovingActor]:
        """Generates a list of all the actors that will move"""

        moving_actors: Dict[Position, MovingActor] = {}
        actor_moves = self.generate_actor_moves()
        for moving_actor in actor_moves:

            # The actor chose to stay
            if moving_actor.action == ActorMoves.STAY:
                continue

            next_position = env.calculate_actor_move(moving_actor.last_position, moving_actor.action)

            # The actors destination is occupied by another actor
            if self.has_actor(next_position):
                continue

            # The actors destination is free
            if next_position not in moving_actors:
                moving_actors.update({next_position: moving_actor})
                continue

            # The actors destination is contested by another moving actor
            contestant_actor = moving_actors.get(next_position)
            if moving_actor.actor.has_priority(contestant_actor.actor):
                moving_actors.update({next_position: moving_actor})

        return moving_actors

    def move_actor(self, position: Position, moving_actor: MovingActor):
        self.add_actor(moving_actor.actor, position)
        self.remove_actor(moving_actor.last_position)


class SimulationEngine:

    def __init__(self, width: int, height: int):

        self.env = Environment(width, height)
        self.actors_manager = ActorsManager()
        self.food: Dict[Position, Food] = {}
        self.food_respawn = 0

    def initialize_simulation(self, num_actors: int, num_food: int):
        self.populate_actors(num_actors)
        self.populate_food(num_food)

    def add_food(self, food: Food, position: Position):
        """Adds an food to the environment in the specified position"""
        self.food.update({position: food})

    def remove_food(self, position: Position):
        """Removes food from the specified position"""
        self.food.pop(position)

    def is_position_free(self, position: Position) -> bool:
        """Checks if a position is available in the environment"""
        return not self.actors_manager.has_actor(position) and position not in self.food

    def generate_random_position(self) -> Position:
        """Generates an available position in the environment"""
        while True:
            position = Position(randrange(self.env.width), randrange(self.env.height))
            if self.is_position_free(position):
                break
        return position

    def populate_actors(self, num_actors: int):
        """Populates the environment with random actors in random positions"""
        for _ in range(num_actors):
            position = self.generate_random_position()
            actor = Actor.generate_random()
            self.actors_manager.add_actor(actor=actor, position=position)

    def populate_food(self, num_food: int):
        """Populates the environment with food in random positions"""
        for _ in range(num_food):
            position = self.generate_random_position()
            food = Food()
            self.add_food(food=food, position=position)

    def step_operations(self):
        """Perform environmental updates"""
        positions_to_kill: List[Position] = []
        for position, actor in self.actors_manager.items():
            actor.increase_age()
            if actor.has_to_die():
                positions_to_kill.append(position)

        for pos in positions_to_kill:
            self.actors_manager.remove_actor(pos)

        self.food_respawn += 1
        if not self.food_respawn % 100:
            self.populate_food(80)

    def step(self):
        self.step_operations()
        moving_actors = self.actors_manager.get_moving_actors(self.env)

        for position, moving_actor in moving_actors.items():
            self.actors_manager.move_actor(position=position, moving_actor=moving_actor)
            if position in self.food:
                self.remove_food(position)
                self.actors_manager.add_actor(actor=moving_actor.actor.reproduce(),
                                              position=moving_actor.last_position)

    def export_state_json(self) -> List[Dict]:
        """Exports actors states as dictionaries ready to jsonify"""
        entities: List[Dict] = []
        for position, actor in self.actors_manager.items():
            actor_state = {"x": position.x,
                           "y": position.y,
                           "type": "Actor"}
            actor_state.update(actor.as_json())
            entities.append(actor_state)

        for position, food in self.food.items():
            food_state = {"x": position.x,
                          "y": position.y,
                          "type": "Food"}
            entities.append(food_state)

        return entities


def main():
    sim = SimulationEngine(3, 3)
    sim.initialize_simulation(num_actors=2, num_food=2)

    for _ in range(200):
        sim.step()


if __name__ == '__main__':
    main()
