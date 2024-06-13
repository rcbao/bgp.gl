# bgp.gl: deck.gl-powered BGP Traffic Dashboard

bgp.gl is a deck.gl-powered data dashboard for Border Gateway Protocol (BGP) traffic in the US. It uses a snapshot dataset from [RouteViews](https://www.routeviews.org/routeviews/) and processes the dataset using Pandas, Dask, and a fast IP geocoder based on an in-memory SQL database.

This project was built in collaboration with Joseph Moretto, Jade Gregoire, and Kaylee Liu. It was the final project submission for UVA's Network Security and Privacy course (CS 6501) in Spring 2024.

<img src="https://github.com/robertchenbao/us-bgp-dashboard/assets/30555057/74b2ae9a-85e1-4fe1-82d8-6029b2ddb5ee" alt="BGP Dashboard Screenshot" style="max-width:80%; height:auto;">

## Set up

To set up the frontend, run the following commands:

```bash
cd frontend
npm install
npm run dev
```

To set up the backend, run the following commands:

```bash

pip install --user pipenv  # Install the pipenv package if it has not been installed already

pipenv shell  # Activate pipenv environment
pipenv install  # Install requirements in pipfile

python manage.py runserver  # once everything has been set up, start the django server to see the app running on http://127.0.0.1:8000/
```

If you recieve a warning about unapplied migrations, run;
`python manage.py makemigrations` and `python manage.py migrate`

## More Screeshots

The dashboard provides a hexagon-based heatmap for each state's BGP pattern, as well as more detailed traffic metrics. Below are additional app screenshots, specifically maps for the states of California and Florida.

<p float="left">
  <img src="https://github.com/robertchenbao/us-bgp-dashboard/assets/30555057/6bd4e443-4ef5-49fa-aa65-e53aec5d7d4b" width="500" />
  <img src="https://github.com/robertchenbao/us-bgp-dashboard/assets/30555057/9870c56b-47e9-4811-8b7c-8b6bc640d875" width="500" />
</p>

## License
MIT License
