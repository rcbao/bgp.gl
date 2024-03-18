# cs-6501-us-bgp-dashboard

The US BGP dashboard project for CS 6501: Network security and privacy. Made by Joseph, Jade, Kaylee, and Robert.

> **Note: the repo current contains Robert's proof-of-concept work. The final configuration of the project may change as the group develop it.**

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
