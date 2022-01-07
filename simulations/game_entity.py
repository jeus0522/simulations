from abc import ABC, abstractmethod


class BaseId(ABC):

    def __init__(self, idx: str):
        self.idx = idx

    def __eq__(self, other):
        return self.idx == other.idx

    def __hash__(self):
        return hash(self.__repr__())

    def __repr__(self):
        return self.idx

    @classmethod
    @abstractmethod
    def generate_id(cls):
        """Generate a new ID"""


class GameEntity:

    def __init__(self, idx: BaseId):
        self.idx = idx
