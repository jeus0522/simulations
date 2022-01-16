from time import time
from typing import Tuple

import pygame

from simulations import SimulationEngine


FPS = 30
POSITION_SIDE = 10


class Colors:
    WHITE = (255, 255, 255)
    RED = (255, 0, 0)
    BLUE_JEANS = (67, 175, 252)


class Entity(object):

    def __init__(self, side: int, color: Tuple[int]):

        self.color = color
        self.surface = pygame.Surface((side, side))
        self.surface.fill(Colors.WHITE)
        pygame.draw.circle(self.surface, color, (side / 2, side / 2), side / 2)

    def render(self, window: pygame.Surface, position: Tuple[int, int]):
        """Render element to screen"""
        window.blit(self.surface, position)


class SimulationVisualization(object):

    def __init__(self):
        self.engine = SimulationEngine(100, 100, 160)
        self.engine.initialize_simulation(200)

        window_size = (self.engine.env.width * POSITION_SIDE, self.engine.env.height * POSITION_SIDE)
        self.window = pygame.display.set_mode(window_size)
        pygame.display.set_caption("Simulation")

        self.background = pygame.Surface(window_size)
        self.background.fill(Colors.WHITE)

        pygame.display.set_caption("Simulation")

    def render(self):
        self.window.blit(self.background, (0, 0))
        data = self.engine.export_state_json()

        for entity in data:
            if entity["type"] == "Actor":
                actor = Entity(side=POSITION_SIDE, color=(67, 175, entity["reaction_speed"] * 255))
                actor.render(position=(entity["x"] * POSITION_SIDE, entity["y"] * POSITION_SIDE), window=self.window)
                continue

            if entity["type"] == "Food":
                food = Entity(side=POSITION_SIDE, color=Colors.RED)
                food.render(position=(entity["x"] * POSITION_SIDE, entity["y"] * POSITION_SIDE), window=self.window)
        pygame.display.update()

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

            now = time()
            if now - last_update >= 0.05:
                self.engine.step()
                last_update = now

            self.render()


def main():

    engine = SimulationVisualization()
    engine.run_simulation()
    pygame.quit()


if __name__ == '__main__':
    main()
