import tkinter as tk
from tkinter import ttk

from simulations.actors.brain import Brain
from simulations.environment import ActorSensors, ActorMoves


class BrainTable(ttk.Treeview):
    def __init__(self, master: tk.Tk):
        super().__init__(master)
        self.master = master
        self.pack()

        self.sensors = tuple([sensor.name for sensor in ActorSensors])
        self["columns"] = list(self.sensors)

        self.column("#0", width=80, stretch=tk.NO)
        for i, sensor in enumerate(self.sensors):
            self.column(sensor, anchor=tk.CENTER, width=80)

        self.heading("#0", text="Action")
        for sensor in self.sensors:
            self.heading(sensor, text=sensor, anchor=tk.CENTER)

    def update_table(self, brain: Brain):
        self.delete(*self.get_children())
        weights = brain.weights.T
        for i, row in enumerate(weights):
            self.insert("", "end", text=ActorMoves(i).name, values=tuple(row))
        super().update()
        super().pack()
