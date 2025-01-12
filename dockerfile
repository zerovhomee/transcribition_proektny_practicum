FROM python:3.9-slim


RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip


COPY requirements.txt .
RUN pip install -r requirements.txt


COPY . /app
WORKDIR /app


EXPOSE 8080
EXPOSE 80

CMD ["python", "server.py"]
