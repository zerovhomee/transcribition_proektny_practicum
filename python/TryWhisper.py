import whisper
import base64
import io

def transcribate(audio):
     # Декодируем аудио из Base64
    #audio_data = base64.b64decode(audio_base64)
    #audio_buffer = io.BytesIO(audio_data)

    # Загружаем модель и выполняем транскрибацию
    model = whisper.load_model("base")
    file = whisper.load_audio(audio)
    result = model.transcribe(file)

    return result["text"] #commit
