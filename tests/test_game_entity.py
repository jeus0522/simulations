import pytest

from simulations.game_entity import GameEntity, BaseIDGenerator


def test_game_entity():
    ge = GameEntity(idx="test")
    assert ge.idx == "test"


def test_base_id_generator_error():
    with pytest.raises(AttributeError):
        BaseIDGenerator.generate_id()
        next(BaseIDGenerator.id_iter)
