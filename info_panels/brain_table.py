import tkinter as tk
from tkinter import ttk

from simulations.actors.brain import Brain
from simulations.environment import ActorSensors, ActorMoves


TableRow = tuple[str, float, str]


class BrainTable(ttk.Treeview):
    def __init__(self, master: tk.Tk):
        super().__init__(master)
        self.master = master
        self.pack()

        headers = ("SENSOR", "VALUE", "ACTION")
        self["columns"] = headers
        self.column("#0", width=0, stretch=tk.NO)
        for h in headers:
            self.column(h, width=120, stretch=tk.NO, anchor=tk.CENTER)
            self.heading(h, text=h, anchor=tk.CENTER)

    def update_table(self, brain: Brain):
        self.delete(*self.get_children())
        rows = self._get_rows(brain)
        for i, row in enumerate(rows):
            self.insert("", "end", values=row)
        super().update()
        super().pack()

    @staticmethod
    def _get_rows(brain: Brain) -> list[TableRow]:
        weights = brain.weights

        rows = []
        for sensor, action_values in zip(ActorSensors, weights):
            for action, value in zip(ActorMoves, action_values):
                if value != 0.0:
                    rows.append((sensor.name, value, action.name))

        return rows
