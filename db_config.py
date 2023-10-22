import sqlite3

con = sqlite3.connect('material.db',check_same_thread=False)
c = con.cursor()


def insert_host(host):
    print(host)
    result = c.execute("INSERT INTO domains (host) VALUES (?)", (host,))
    con.commit()
    return  True if result else False

def query_host(host):
    result = c.execute("select * from domains where host like '%?%'",(host,))
    con.commit()
    return list(result)

def query_all(page_number,page_size):
    offset = (int(page_number) - 1) * int(page_size)
    limit = page_size
    c2 = con.cursor()
    result = c2.execute('SELECT DISTINCT * FROM domains LIMIT ? OFFSET ?', (limit, offset))
    con.commit()
    return list(result)

def query_len():
    c.execute('SELECT COUNT(*) FROM domains')
    count = c.fetchone()  # 使用fetchone()来获取查询结果
    con.commit()
    return count[0] if count else 0  # 返回计数值，如果查询结果为空，则返回0


def delete_host(id):
    result = c.execute('DELETE FROM domains WHERE id = ?', (id,))
    con.commit()
    return  True if result else False

def delete_like(keyword):
    result = c.execute("DELETE FROM domains WHERE host like '%"+keyword.replace("'","")+"%'")
    con.commit()
    return  True if result else False

def delete_list(id):
    result = c.execute('DELETE FROM domains WHERE id < ?', (id,))
    con.commit()
    return  True if result else False

def delete_all():
    result = c.execute("DELETE FROM domains;")
    con.commit()
    return  True if result else False