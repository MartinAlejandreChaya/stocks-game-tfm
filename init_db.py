import os
import psycopg2

from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

# Open connection and create db tables
if (os.environ.get("FLASK_ENV") == "development"):
    conn = psycopg2.connect(
            host="localhost",
            database="stocks_tfm",
            user=os.environ['DB_USERNAME'],
            password=os.environ['DB_PASSWORD'])
else:
    conn = psycopg2.connect(os.environ.get("DATABASE_URL"))

"""DELETE EXISTING DATA"""
"""
with conn.cursor() as cur:
    cur.execute('DROP TABLE players CASCADE')
    cur.execute('DROP TABLE games')

    conn.commit()
    cur.close()
"""

# Open a cursor to perform database operations
with conn.cursor() as cur:
    cur.execute('CREATE TABLE IF NOT EXISTS players ('
         'id serial PRIMARY KEY,'
         'date DATE NOT NULL,'
         'age integer NOT NULL,'
         'gender varchar(10),'
         'study_level varchar(20) NOT NULL,'
         'study_field varchar(150),'
         'oponent_id integer NOT NULL,'
         'average_score DECIMAL,'
         'finished boolean DEFAULT FALSE'
         ');')

    cur.execute('CREATE TABLE IF NOT EXISTS games ('
        'id serial PRIMARY KEY,'
        'player_id integer REFERENCES players(id),'
        'state_day int NOT NULL,'
        'state_price decimal NOT NULL,'
        'state_other_selled boolean NOT NULL,'
        'action boolean NOT NULL,'
        'result DECIMAL'
        ');')

    cur.execute('CREATE TABLE IF NOT EXISTS concurso ('
        'id serial PRIMARY KEY,'
        'player_id integer REFERENCES players(id),'
        'player_paypal varchar(150) NOT NULL,'
        ');')

    conn.commit()
    cur.close()

