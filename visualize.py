from time import time
from typing import Tuple

import pygame

from simulations import Environment


FPS = 30
POSITION_SIDE = 30


class Colors:
    WHITE = (255, 255, 255)
    RED = (255, 0, 0)
    BLUE_JEANS = (67, 175, 252)


class Actor(object):

    def __init__(self, side: int, color: Tuple[int]):

        self.color = color
        self.surface = pygame.Surface((side, side))
        self.surface.fill(Colors.WHITE)
        pygame.draw.circle(self.surface, color, (side / 2, side / 2), side / 2)

    def render(self, window: pygame.Surface, position: Tuple[int, int]):
        """Render element to screen"""
        window.blit(self.surface, position)


class SimulationEngine(object):

    def __init__(self):
        self.env = Environment(10, 10)
        self.env.populate(20)

        window_size = (self.env.width * POSITION_SIDE, self.env.height * POSITION_SIDE)
        self.window = pygame.display.set_mode(window_size)
        pygame.display.set_caption("Simulation")

        self.background = pygame.Surface(window_size)
        self.background.fill(Colors.WHITE)

        pygame.display.set_caption("Simulation")

    def render(self):
        self.window.blit(self.background, (0, 0))

        actors = self.env.export_actors_json()["actors"]
        for a in actors:
            actor = Actor(side=POSITION_SIDE, color=(67, 175, a["reaction_speed"] * 255))
            actor.render(position=(a["x"] * POSITION_SIDE, a["y"] * POSITION_SIDE), window=self.window)

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
            if now - last_update >= 0.1:
                self.env.step()
                last_update = now

            self.render()


def main():

    engine = SimulationEngine()
    engine.run_simulation()


if __name__ == '__main__':
    main()
