import whisper
import base64
import io
import torch
from transformers import pipeline

def transcribate(audio):
     # Декодируем аудио из Base64
    #audio_data = base64.b64decode(audio_base64)
    #audio_buffer = io.BytesIO(audio_data)

    # Загружаем модель и выполняем транскрибацию
     device = "cuda:0" if torch.cuda.is_available() else "cpu"
     whisper = pipeline(
     "automatic-speech-recognition",
     model="openai/whisper-medium",
     chunk_length_s=30,
     device=device,
     )
     text = whisper(audio)["text"] #текст

     return text #commit
