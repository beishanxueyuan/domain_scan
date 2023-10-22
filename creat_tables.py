import sqlite3

def create_table():
    con = sqlite3.connect('material.db', check_same_thread=False)
    c = con.cursor()
    sql = '''CREATE TABLE IF NOT EXISTS js 
            (id INTEGER PRIMARY KEY AUTOINCREMENT,
            host TEXT,
            js_url TEXT,
            js_len TEXT,
            is_changed INTEGER);
            '''
    sql2 = '''CREATE TABLE IF NOT EXISTS domains
              (id INTEGER PRIMARY KEY AUTOINCREMENT,
              host TEXT)'''
    c.execute(sql)
    c.execute(sql2)
    con.commit()
    con.close()

create_table()