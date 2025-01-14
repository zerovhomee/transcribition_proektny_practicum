import whisper
import torch
from transformers import pipeline

def transcribate(audio):
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
