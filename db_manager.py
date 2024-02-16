from csv import DictWriter

DB_PATH = "./db/data.csv"
DB_FIELD_NAMES = ["name", "date", "move_id",
                  "state_day", "state_price", "state_other_selled",
                  "action", "result"]

def add_row(row):

    # TODO: Verify row is correct

    with open(DB_PATH, 'a', newline='') as f_object:

        dictwriter_object = DictWriter(f_object, fieldnames=DB_FIELD_NAMES)

        dictwriter_object.writerow(row)

        f_object.close()