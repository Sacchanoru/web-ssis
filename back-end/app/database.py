import psycopg2
from flask import current_app, g


def get_db():
    """
    Returns a psycopg2 connection stored in Flask's `g` object.
    Ensures only one connection per request.
    """
    if 'db' not in g:
        g.db = psycopg2.connect(current_app.config["DATABASE_URL"])
    return g.db


def close_db(e=None):
    """
    Closes the psycopg2 connection at the end of a request.
    """
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_app(app):
    """
    Registers the teardown function so Flask knows when to close the DB.
    """
    app.teardown_appcontext(close_db)