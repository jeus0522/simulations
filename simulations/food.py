import itertools

from simulations.game_entity import GameEntity, BaseIDGenerator


class FoodID(BaseIDGenerator):
    """Generates unique IDs for foods"""
    prefix = "Food"
    id_iter = itertools.count()


class Food(GameEntity):

    def __init__(self):

        idx = FoodID.generate_id()
        super().__init__(idx=idx)
