class MapDataConnector:
    """
    This class is responsible for connecting to the database and returning the data for the map view.
    """

    def __init__(self, state: str = None) -> None:
        self.state = state

    def get_state_data(self) -> dict:
        """
        This method returns the data for the state.
        """
        return {"location": self.state}

    def get_us_data(self) -> dict:
        """
        This method returns the data for the entire US.
        """
        return {"location": "US"}
