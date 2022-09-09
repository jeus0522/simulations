from importlib import reload

import pytest

from simulations.actors import actors


@pytest.fixture()
def fixture_actor_id():
    reload(actors)
    yield actors.ActorID


def test_actor_id_generation(fixture_actor_id):
    idx = fixture_actor_id.generate_id()
    assert idx == "Tito-00000"
    idx = fixture_actor_id.generate_id()
    assert idx == "Tito-00001"


def test_actor_id_generation_is_global():
    idx = actors.ActorID.generate_id()
    assert idx != "Tito-00000"
    idx = actors.ActorID.generate_id()
    assert idx == "Tito-00003"


def test_actor_id_generation_reload(fixture_actor_id):
    idx = fixture_actor_id.generate_id()
    assert idx == "Tito-00000"
    idx = fixture_actor_id.generate_id()
    assert idx == "Tito-00001"
