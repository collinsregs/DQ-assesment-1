from gramformer import Gramformer
from flask import Flask, request, jsonify

app = Flask(__name__)

# Initialize Gramformer model (once)
gf = Gramformer(models=1, use_gpu=False)  # 1 = corrector

@app.route('/correct', methods=['POST'])
def correct_sentence():
  data = request.get_json()
  sentence = data.get('sentence')
  corrected_sentences = gf.correct(sentence, max_candidates=1)
  print("corrected sentences", corrected_sentences)
  corrected_sentences_list =list(corrected_sentences)
  corrected_text = corrected_sentences_list[0] if corrected_sentences_list else None
  highlight_text = gf.highlight(sentence, corrected_text)
  print("highlighted text:", highlight_text)
  return jsonify({'corrected_text': highlight_text})

if __name__ == '__main__':
  app.run(debug=True)
