FROM python:3.9
LABEL authors="trueBedolagi"

RUN apt-get update && apt-get upgrade -y
RUN mkdir /site
COPY  . /site/
WORKDIR /site

RUN pip install --upgrade pip
RUN pip install asyncio
RUN pip install websockets
RUN pip install git+https://github.com/openai/whisper.git 
RUN apt-get install -y ffmpeg


WORKDIR /usr/share/nginx/html/
COPY index.html ./
COPY style/styles.css .

CMD ["python", "./server.py"]