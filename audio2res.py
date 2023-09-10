import whisper
import subprocess
import os

model = whisper.load_model("small")
result = model.transcribe("audio_input.wav")
with open("audio.txt", 'w') as f:
    f.write(result)
    subprocess.run(['python', 'text2res.py'])
os.remove("audio.txt")