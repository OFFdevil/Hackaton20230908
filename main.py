from flask import Flask, request, render_template, send_file, jsonify
import subprocess

app = Flask(__name__)

# Маршрут для обработки текстовых запросов
@app.route('/text-process', methods=['POST'])
def text_process():
    try:
        text_question = request.form.get('question', '')
        
        # Вызовите Python-скрипт для обработки текстового вопроса
        subprocess.run(['python', 'process_text.py', text_question])

        # Чтение текстового ответа из файла
        with open('result.txt', 'r') as text_file:
            text_response = text_file.read()

        return jsonify(text_response=text_response)
    except Exception as e:
        return jsonify(error=str(e))

# Маршрут для обработки аудио запросов
@app.route('/audio-process', methods=['POST'])
def audio_process():
    try:
        audio_data = request.data  # Получите аудио-запись от клиента

        # Сохраните аудио-запись в файл
        with open('audio_input.wav', 'wb') as audio_file:
            audio_file.write(audio_data)

        # Вызовите Python-скрипт для обработки аудио
        subprocess.run(['python', 'process_audio.py', 'audio_input.wav'])

        # Прочтите текстовый ответ из result.txt
        with open('result.txt', 'r') as text_file:
            text_response = text_file.read()

        return jsonify(text_response=text_response)
    except Exception as e:
        return jsonify(error=str(e))

# Маршрут для отображения формы
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
