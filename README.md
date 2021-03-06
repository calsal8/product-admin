# Product Admin

This is a project where you can administrate products. Made by [calsal8](https://github.com/calsal8/) for own purpose.

## Features

This project can list, create, update and remove products with different variants.

The api is built in [Django Rest Framework](http://www.django-rest-framework.org/), which uses a [sqlite](https://sqlite.org/) database.
The frontend application is built in Javascript [React framework](https://reactjs.org/) and uses the [flux](https://facebook.github.io/flux/) data pattern.   

## Requirements

* Python
* pip 
* virtualenv
* npm

## Installation

1. Clone this project
2. Start local server for python environment
    1. Open a terminal and `cd` to `product-admin/api`
    2. Run `virtualenv env`
    2. Run `source env/bin/activate` (On Windows use `env\Scripts\activate`)
    3. Run `pip install -r requirements.txt`
    4. Run `./manage.py runserver` and keep it running
    5. Browse `http://localhost:8000/api/`, if you want to check the api UI
3. Start local server for frontend environment
    1. Open another terminal and `cd` to `product-admin/frontend`
    2. Run `npm install`
    3. Run `npm start` or `yarn start`
    4. Browse `http://localhost:3000/` in your browser

### Things that are missing/coming

* Components should be broken down to smaller components
* A nice animated loader
* BUG: After edit of an existing product´s variant and press 'Close' button, it updates the info in product list, but not in the database. Pressing 'Close' button should not affect any data.
