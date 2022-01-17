from typing import Dict, List

import numpy as np

from simulations.actors import Actor, MovingActor, Tito
from simulations.actors.actors import ActorID
from simulations.environment import Environment, Position, ActorMoves, ActorSensors, Directions
from simulations.food import Food
from simulations.actors.brain import BrainGenerator


class ActorsManager:

    def __init__(self):
        self.brain_generator = BrainGenerator(sensors=ActorSensors, actions=ActorMoves, num_genes=10,
                                              hex_bits=2, weight_limits=5)
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

    def move_actor(self, position: Position, moving_actor: MovingActor):
        self.add_actor(moving_actor.actor, position)
        self.remove_actor(moving_actor.last_position)

    def generate_random_actor(self) -> Actor:
        actor = Tito.create_random()
        idx = ActorID.generate_id()
        brain = self.brain_generator.generate_brain()
        return Actor(actor=actor, idx=idx, family=idx.idx, brain=brain)


class SimulationEngine:

    def __init__(self, width: int, height: int, num_food: int):

        self.env = Environment(width, height)
        self.actors_manager = ActorsManager()
        self.food: Dict[Position, Food] = {}
        self.food_respawn = 0
        self.num_food = num_food

    def get_cell_state(self, position) -> str:

        if self.actors_manager.has_actor(position):
            return "ACTOR"

        if position in self.food:
            return "FOOD"

        if not self.env.is_inside(position):
            return "WALL"

        return None

    def get_position_states(self, position: Position) -> np.array:

        state_vector = np.zeros(len(ActorSensors))

        for dir_idx, direction in enumerate(Directions):
            sensed_position = position.add_tuple(direction.value)
            sensed_entity = self.get_cell_state(sensed_position)

            if sensed_entity is None:
                continue

            state_vector_id = ActorSensors[f"{sensed_entity}_{direction.name}"].value
            state_vector[state_vector_id] = 1.

        return state_vector

    def generate_actor_moves(self) -> List[MovingActor]:
        """Generates a list of moving actors with the actors in the environment"""
        moving_actors_list: List[MovingActor] = []
        for position, actor in self.actors_manager.items():
            env_state = self.get_position_states(position=position)
            action = actor.move(state_vector=env_state)
            moving_actors_list.append(MovingActor(actor=actor, last_position=position, action=action))
        return moving_actors_list

    def get_moving_actors(self) -> Dict[Position, MovingActor]:
        """Generates a list of all the actors that will move"""

        moving_actors: Dict[Position, MovingActor] = {}
        actor_moves = self.generate_actor_moves()
        for moving_actor in actor_moves:

            # The actor chose to stay
            if moving_actor.action == ActorMoves.STAY.name:
                continue

            next_position = self.env.calculate_actor_move(moving_actor.last_position, moving_actor.action)

            # The actors destination is occupied by another actor
            if self.actors_manager.has_actor(next_position):
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

    def initialize_simulation(self, num_actors: int):
        self.populate_actors(num_actors)
        self.populate_food()

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
            position = self.env.generate_random_position()
            if self.is_position_free(position):
                break
        return position

    def populate_actors(self, num_actors: int):
        """Populates the environment with random actors in random positions"""
        for _ in range(num_actors):
            position = self.generate_random_position()
            actor = self.actors_manager.generate_random_actor()
            self.actors_manager.add_actor(actor=actor, position=position)

    def populate_food(self):
        """Populates the environment with food in random positions"""
        for _ in range(self.num_food):
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
            self.populate_food()

    def step(self):
        self.step_operations()
        moving_actors = self.get_moving_actors()

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
                           "first_gen": actor.brain.genome[0].as_str(),
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
    sim = SimulationEngine(3, 3, num_food=2)
    sim.initialize_simulation(num_actors=2)

    for _ in range(200):
        sim.step()


if __name__ == '__main__':
    main()
