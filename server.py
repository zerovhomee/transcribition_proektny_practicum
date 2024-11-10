import websockets
import asyncio
import json
from python import TryWhisper # Импорт функции для транскрибации
import base64
import tempfile
import os

async def transcribe(websocket, path=None):
    print("Connection established")
    try:
        async for message in websocket:
            print("Received message:", message)  # Логируем полученные данные
            data = json.loads(message)
            audio_content_base64 = data["audio_content"]

            # Декодируем Base64 и записываем во временный файл
            audio_bytes = base64.b64decode(audio_content_base64)
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio_file:
                temp_audio_file.write(audio_bytes)
                temp_audio_path = temp_audio_file.name

            # Передаем путь временного файла в функцию транскрибации
            transcription_text = TryWhisper.transcribate(temp_audio_path)

            # Удаляем временный файл после транскрибации
            os.remove(temp_audio_path)

            # Отправляем результат обратно
            response = json.dumps({"transcription": transcription_text})
            await websocket.send(response)
            print("Sent transcription:", transcription_text)
            # Удаляем временный файл после транскрибации
            os.remove(temp_audio_path)
    except Exception as e:
        print(f"Error processing message: {e}")
        await websocket.send(json.dumps({"error": str(e)}))


async def main():
    async with websockets.serve(transcribe, "localhost", 8765):
        print("WebSocket server is running on ws://localhost:8765")
        await asyncio.Future()  # Бесконечное ожидание для поддержания работы сервера

# Запуск основного цикла событий
if __name__ == '__main__':
    asyncio.run(main())
