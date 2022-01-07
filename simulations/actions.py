from typing import Protocol

from simulations.game_entity import GameEntity


class BaseAction(Protocol):

    def execute(self, entity: GameEntity):
        """Executes the action on the """