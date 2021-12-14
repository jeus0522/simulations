import inspect
from typing import List


class Constants:

    @classmethod
    def values_as_list(cls) -> List:

        return [x[1] for x in inspect.getmembers(cls)
                if not x[0].startswith("__")
                and not inspect.ismethod(x[1])]
