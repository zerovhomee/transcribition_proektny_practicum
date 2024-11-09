import whisper

model = whisper.load_model("base")
file = whisper.load_audio("Путь к треку")
result = model.transcribe(file)

print(result["text"]) #commit