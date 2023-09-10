from flask import Flask, request, jsonify
import os
import speech_recognition as sr
from gtts import gTTS

app = Flask(__name__)

output_folder = "output"

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

@app.route('/record-voice', methods=['POST'])
def record_voice():
    # Здесь можно добавить код для обработки записи голосом
    # Например, сохранить аудио, распознать его и отправить ответ

    response_text = "Пример ответа на запись голосом"
    mp3_response_file = os.path.join(output_folder, "result.mp3")
    tts = gTTS(response_text, lang='ru')
    tts.save(mp3_response_file)

    return jsonify({"text_response": response_text, "audio_response": mp3_response_file})

@app.route('/text-question', methods=['POST'])
def text_question():
    data = request.get_json()
    question_text = data.get('question', '')
    response_mode = data.get('response_mode', 'text')

    if response_mode == 'voice':
        # Здесь можно добавить код для генерации аудио ответа
        response_text = "Пример аудио ответа на вопрос"
        mp3_response_file = os.path.join(output_folder, "result.mp3")
        tts = gTTS(response_text, lang='ru')
        tts.save(mp3_response_file)
    else:
        # Здесь можно добавить код для текстового ответа
        response_text = "Пример текстового ответа на вопрос"
        txt_response_file = os.path.join(output_folder, "result.txt")
        with open(txt_response_file, 'w', encoding='utf-8') as text_file:
            text_file.write(response_text)

    return jsonify({"text_response": response_text})

if __name__ == '__main__':
    app.run(debug=True)
