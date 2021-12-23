import itertools

from simulations.game_entity import GameEntity, BaseId


class FoodID(BaseId):
    id_iter = itertools.count()

    @classmethod
    def generate_id(cls):
        idx = f"Food-{next(FoodID.id_iter)}"
        return FoodID(idx)


class Food(GameEntity):

    def __init__(self):

        idx = FoodID.generate_id()
        super().__init__(idx=idx)
