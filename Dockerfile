# 使用Python作为基础图片
FROM python:3.9

# 设置工作目录
WORKDIR /app

# 将当前目录中的文件复制到工作目录中
COPY . .

# 安装应用所需的依赖
RUN pip install --no-cache-dir -r requirements.txt

# 暴露应用运行的端口
EXPOSE 9992

CMD ["python","creat_tables.py"]
# 运行应用
CMD ["python", "app.py"]