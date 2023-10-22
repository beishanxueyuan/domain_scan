## 功能及原理：
1.通过调用互联网上的api在线截图节省信息收集时间

2.通过request定时请求，监控js变化（监控间隔在app.py的```IntervalTrigger(days=1)```）

## 搭建过程
在使用之前要先导入子域名

通过db_config.insert_host函数添加，可自行编写脚本
### 模版：
比如通过fofa api批量添加脚本
```
# -*- coding: utf-8 -*-
import json
import requests
import db_config
import sqlite3


apiurl = 'https://fofa.info/api/v1/search/all?email=&key=&qbase64=&size=10000'
response = requests.get(apiurl)
for i in range(len(json.loads(response.text)['results'])):
    host = json.loads(response.text)['results'][i][0].replace('https://','').replace('http://','')
    db_config.insert_host(host)
con = sqlite3.connect('material.db',check_same_thread=False)
c2 = con.cursor()
#去重
result = c2.execute('''DELETE FROM domains 
WHERE rowid NOT IN (SELECT min(rowid) 
                    FROM domains 
                    GROUP BY host);''')
con.commit()
print(list(result))
```

如果是在容器外面运行，需要选运行creat_tables.py创建数据库

容器内可直接运行即可

容器内
```
docker build -t domain_scan .
```
```
docker run -d --name domain_scan -p 9992:9992 domain_scan
```

访问9992端口

<img width="1414" alt="image" src="https://github.com/beishanxueyuan/domain_scan/assets/138347114/0ec66232-e7cf-41d9-848a-7d44c2d6f75e">



要清除数据直接删除material.db就行了
