from flask import Flask, render_template, request,jsonify
import db_config
import js_config
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/lookjs')
def lookjs():
    return render_template('lookjs.html')

@app.route('/delete',methods=['POST'])
def delete():
    id = request.json.get('id')
    result=db_config.delete_host(id)
    return 'success' if result else 'error'

@app.route('/delete_list',methods=['POST'])
def delete_list():
    id = request.json.get('id')
    result=db_config.delete_list(id)
    return 'success' if result else 'error'

@app.route('/delete_like',methods=['POST'])
def delete_like():
    keyword = request.json.get('keyword')
    result=db_config.delete_like(keyword)
    return 'success' if result else 'error'

@app.route('/delete_all',methods=['POST'])
def delete_all():
    result=db_config.delete_all()
    return 'success' if result else 'error'

@app.route('/query_all',methods=['GET'])
def query_all():
    page_number = request.args.get('page_number')
    page_size = request.args.get('page_size')
    content=db_config.query_all(page_number,page_size)
    response_data = {
        'data': content
    }
    return jsonify(response_data)

@app.route('/query_len',methods=['GET'])
def query_len():
    count=db_config.query_len()
    return str(count)


@app.route('/insert',methods=['POST'])
def insert():
    host = request.json.get('host')
    result=db_config.insert_host(host)
    return 'success' if result else 'error'

# js监控
@app.route('/query_all_js',methods=['GET'])
def query_all_js():
    page_number = request.args.get('page_number')
    page_size = request.args.get('page_size')
    content=js_config.query_all_js(page_number,page_size)
    response_data = {
        'data': content
    }
    return jsonify(response_data)

@app.route('/insert_js',methods=['POST'])
def insert_js():
    js_url = request.json.get('js_url')
    host = request.json.get('host')
    result=js_config.insert_js(js_url,host)
    return str(result)

@app.route('/delete_js',methods=['POST'])
def delete_js():
    id = request.json.get('id')
    result=js_config.delete_js(id)
    return 'success' if result else 'error'

@app.route('/sloved',methods=['POST'])
def sloved():
    id = request.json.get('id')
    result=js_config.sloved(id)
    return 'success' if result else 'error'

scheduler = BackgroundScheduler(daemon=True,max_instances=1)
trigger = IntervalTrigger(days=1)
scheduler.add_job(js_config.update_all, trigger)
scheduler.start()

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=80,debug=True)