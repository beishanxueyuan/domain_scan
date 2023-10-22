import sqlite3
import requests

con = sqlite3.connect('material.db',check_same_thread=False)
c = con.cursor()


def insert_js(js_url,host):
    js_len = len(requests.get(js_url).text)
    result = c.execute("INSERT INTO js (host,js_url,js_len) VALUES (?,?,?)", (host,js_url,js_len))
    con.commit()
    return  True if result else False

def query_all_js(page_number,page_size):
    offset = (int(page_number) - 1) * int(page_size)
    limit = page_size
    c2 = con.cursor()
    result = c2.execute('SELECT * FROM js ORDER BY is_changed desc LIMIT ? OFFSET ? ', (limit, offset))
    con.commit()
    return list(result)

def delete_js(id):
    result = c.execute('DELETE FROM js WHERE id = ?', (id,))
    con.commit()
    return  True if result else False

def sloved(id):
    result = c.execute("UPDATE js SET is_changed=0 WHERE id = ?", (id,))
    con.commit()
    return  True if result else False

def update_all():
    c.execute("SELECT max(id) FROM js")
    max_id = c.fetchone()[0]
    con.commit()
    for id in range(1, max_id + 1):
        c.execute("SELECT js_url, js_len FROM js WHERE id = ?", (id,))
        row = c.fetchone()
        if row is None:
            continue
        con.commit()
        js_url = row[0]
        old_len = row[1]
        js_len = len(requests.get(js_url).text)
        if int(js_len) != int(old_len):
            c.execute("UPDATE js SET js_len = ?, is_changed =1 WHERE id = ?", (js_len, id))
            con.commit()