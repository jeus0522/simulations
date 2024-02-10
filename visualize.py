from time import time
from typing import Tuple
import tkinter as tk

import pygame

from info_panels.brain_table import BrainTable
from simulations import SimulationEngine, Actor
from simulations.environment import Position


FPS = 30
POSITION_SIDE = 10


class Colors:
    WHITE = (255, 255, 255)
    RED = (255, 0, 0)
    BLUE_JEANS = (67, 175, 252)


class Entity(object):

    def __init__(self, side: int, color: Tuple[int, int, int] | pygame.Color):

        self.color = color
        self.surface = pygame.Surface((side, side))
        self.surface.fill(Colors.WHITE)
        pygame.draw.circle(self.surface, color, (side / 2, side / 2), side / 2)

    def render(self, window: pygame.Surface, position: Tuple[int, int]):
        """Render element to screen"""
        window.blit(self.surface, position)


class InfoPanel(tk.Frame):
    def __init__(self, master: tk.Tk):
        super().__init__(master)
        self.master = master
        self.canvas = tk.Canvas(self, width=300, height=300)
        self.canvas.pack()
        self.pack()

        self.age = tk.Label(master, text="Age: ", bd=1, relief="solid")
        self.age.pack(padx=5, pady=5)
        self.age.place(x=20, y=20)

        self.family = tk.Label(master, text="Family: ", bd=1, relief="solid")
        self.family.pack(padx=5, pady=5)
        self.family.place(x=20, y=40)

        self.brain_table = BrainTable(master)

    def update_text(self, actor: Actor):
        self.age.config(text=f"Age: {actor.age}")
        self.family.config(text=f"Family: {actor.family}")

    def update_info(self, actor: Actor) -> None:
        self.update_text(actor)
        self.brain_table.update_table(actor.brain)
        super().update()


class SimulationVisualization(object):

    def __init__(self):
        self.engine = SimulationEngine(100, 100, 160)
        self.engine.initialize_simulation(200)

        self.tk = tk.Tk()
        self.tf_frame = InfoPanel(self.tk)

        window_size = (self.engine.env.width * POSITION_SIDE, self.engine.env.height * POSITION_SIDE)
        self.window = pygame.display.set_mode(window_size)
        pygame.display.set_caption("Simulation")

        self.background = pygame.Surface(window_size)
        self.background.fill(Colors.WHITE)

        self.stopped = False

    def render(self, data: list[dict]):
        self.window.blit(self.background, (0, 0))

        for entity in data:
            if entity["type"] == "Actor":
                color = pygame.Color(f"#{entity['first_gen']}")
                actor = Entity(side=POSITION_SIDE, color=color)
                actor.render(position=(entity["x"] * POSITION_SIDE, entity["y"] * POSITION_SIDE),
                             window=self.window)
                continue

            if entity["type"] == "Food":
                food = Entity(side=POSITION_SIDE, color=Colors.RED)
                food.render(position=(entity["x"] * POSITION_SIDE, entity["y"] * POSITION_SIDE),
                            window=self.window)
        pygame.display.update()

    def handle_actor_click(self, event: pygame.event.Event) -> Actor | None:

        x, y = event.pos
        x = x // POSITION_SIDE
        y = y // POSITION_SIDE
        position = Position(x, y)

        if self.engine.actors_manager.has_actor(position):
            return self.engine.actors_manager.actors[position]
        return None

    def run_simulation(self):
        clock = pygame.time.Clock()
        last_update = time()
        run = True
        while run:
            # This will delay the game to given FPS
            clock.tick(FPS)

            # This will loop through a list of any keyboard or mouse events.
            for event in pygame.event.get():
                # Checks if the red button in the corner of the window is clicked
                if event.type == pygame.QUIT:
                    run = False  # Ends the game loop
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        self.stopped = not self.stopped
                if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                    clicked_actor = self.handle_actor_click(event)
                    if clicked_actor is not None:
                        self.tf_frame.update_info(clicked_actor)

            now = time()
            if not self.stopped:
                if now - last_update >= 0.05:
                    self.engine.step()
                    last_update = now

            data = self.engine.export_state_json()
            self.render(data)


def main():

    engine = SimulationVisualization()
    engine.run_simulation()
    pygame.quit()


if __name__ == '__main__':
    main()
