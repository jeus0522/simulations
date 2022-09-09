from itertools import count


class BaseIDGenerator:
    """Generate unique IDs for entities"""

    prefix: str
    id_iter: count

    @classmethod
    def generate_id(cls) -> str:
        """Generate a new ID"""
        return f"{cls.prefix}-{next(cls.id_iter):05d}"


class GameEntity:

    def __init__(self, idx: str):
        self.idx = idx
