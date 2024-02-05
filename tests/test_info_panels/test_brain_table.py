import pytest
import tkinter as tk

from info_panels.brain_table import BrainTable


@pytest.fixture()
def tkinter_root() -> tk.Tk:
    """Tkinter root fixture"""
    root = tk.Tk()
    yield root
    root.destroy()


def test_brain_table(tkinter_root, brain_generator_fixture):
    # Arrange
    brain_table = BrainTable(tkinter_root)
    brain = brain_generator_fixture.generate_brain()

    # Act
    brain_table.update_table(brain)
    tkinter_root.mainloop()
