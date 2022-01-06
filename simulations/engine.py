from typing import Dict, List

from random import randrange

from simulations import Environment, Position, Actor
from simulations.actors import ActorMoves
from simulations.environment import MovingActor
from simulations.food import Food


class SimulationEngine:

    def __init__(self):

        self.env = Environment(100, 100)
        self.actors: Dict[Position, Actor] = {}
        self.food: Dict[Position, Food] = {}
        self.food_respawn = 0

    def initialize_simulation(self):
        self.populate_actors(100)
        self.populate_food(80)

    def add_actor(self, actor: Actor, position: Position):
        """Adds an actor to the environment in the specified position"""
        self.actors.update({position: actor})

    def remove_actor(self, position: Position):
        """Removes actor from the specified position"""
        self.actors.pop(position)

    def add_food(self, food: Food, position: Position):
        """Adds an food to the environment in the specified position"""
        self.food.update({position: food})

    def remove_food(self, position: Position):
        """Removes food from the specified position"""
        self.food.pop(position)

    def is_position_available(self, position: Position) -> bool:
        """Checks if a position is available in the environment"""
        return position not in self.actors and position not in self.food

    def generate_random_position(self) -> Position:
        """Generates an available position in the environment"""
        while True:
            position = Position(randrange(self.env.width), randrange(self.env.height))
            if self.is_position_available(position):
                break
        return position

    def populate_actors(self, num_actors: int):
        """Populates the environment with random actors in random positions"""
        for _ in range(num_actors):
            position = self.generate_random_position()
            actor = Actor.generate_random()
            self.add_actor(actor=actor, position=position)

    def populate_food(self, num_food: int):
        """Populates the environment with food in random positions"""
        for _ in range(num_food):
            position = self.generate_random_position()
            food = Food()
            self.add_food(food=food, position=position)

    def generate_actor_moves(self) -> List[MovingActor]:
        """Generates a list of moving actors with the actors in the environment"""
        moving_actors_list: List[MovingActor] = []
        for position, actor in self.actors.items():
            action = actor.move()
            moving_actors_list.append(MovingActor(actor=actor, last_position=position, action=action))
        return moving_actors_list

    def apply_actor_moves(self, actor_moves: List[MovingActor]) -> Dict[Position, Actor]:
        """Generates a new dictionary of positions and their actors, based on the passed moves and actors"""

        moving_actors: Dict[Position, MovingActor] = {}
        final_positions: Dict[Position, Actor] = {}
        for moving_actor in actor_moves:

            if moving_actor.action == ActorMoves.STAY:
                final_positions.update({moving_actor.last_position: moving_actor.actor})
                continue

            next_position = self.env.calculate_actor_move(moving_actor.last_position, moving_actor.action)
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

    def step_operations(self):
        """Perform environmental updates"""
        positions_to_kill: List[Position] = []
        for position, actor in self.actors.items():
            actor.increase_age()
            if actor.has_to_die():
                positions_to_kill.append(position)

        for pos in positions_to_kill:
            self.remove_actor(pos)

        self.food_respawn += 1
        if not self.food_respawn % 100:
            self.populate_food(80)

    def step(self):
        self.step_operations()
        actor_moves = self.generate_actor_moves()
        self.actors = self.apply_actor_moves(actor_moves)

    def export_state_json(self) -> Dict:
        """Exports actors states as dictionaries ready to jsonify"""
        result_json = {}
        actors_states: List[Dict] = []
        for position, environment_actor in self.actors.items():
            actor_state = {"x": position.x,
                           "y": position.y,
                           "reaction_speed": environment_actor.actor.reaction_speed,
                           "life_expectancy": environment_actor.actor.life_expectancy}
            actors_states.append(actor_state)
        result_json.update({"actors": actors_states})

        food_states: List[Dict] = []
        for position, food in self.food.items():
            food_state = {"x": position.x,
                          "y": position.y}
            food_states.append(food_state)
        result_json.update({"food": food_states})

        return result_json


def main():
    sim = SimulationEngine()
    sim.initialize_simulation()


if __name__ == '__main__':
    main()
