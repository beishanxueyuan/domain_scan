import sqlite3

con = sqlite3.connect('material.db',check_same_thread=False)

c2 = con.cursor()
result = c2.execute("select * FROM domains WHERE host like '%wj%'")
con.commit()
print(list(result))