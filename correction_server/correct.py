from gramformer import Gramformer
from flask import Flask, request, jsonify
from pdfminer.high_level import extract_text
from io import BytesIO

app = Flask(__name__)

# Initialize Gramformer model (once)
gf = Gramformer(models=1, use_gpu=False)  # 1 = corrector

@app.route('/correct', methods=['POST'])
def correct_sentence():
  data = request.get_json()
  sentence = data.get('document')
  print("text:",sentence)
  lines = sentence.split("\n")
  
  def getCorrections(sentence):
    corrected_sentences = gf.correct(sentence, max_candidates=1)
  # print("corrected sentences", corrected_sentences)
    corrected_sentences_list =list(corrected_sentences)
    
    corrected_text = corrected_sentences_list[0] if corrected_sentences_list else None
    print("list of corrected sentences", corrected_text)
    highlight_text = gf.highlight(sentence, corrected_text)
  # print("highlighted text:", highlight_text)
    return highlight_text
  correct_text =""
  for line in lines:
    print("line to be corrected",line)
    if not line.strip():
      continue
    corrected_line = getCorrections(line)
    correct_text += corrected_line + "\n"
    
  return jsonify({'corrected_text': correct_text})

@app.route("/getText", methods=["POST"])
def get_text():
    print("request:", request)
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        file_buffer = BytesIO(file.read())
        file_buffer.seek(0)  # Ensure the buffer is at the beginning

        # Debugging: Check the content of the file buffer
        print("File buffer content:", file_buffer.getvalue()[:100])  # Print first 100 bytes for inspection

        text = extract_text(file_buffer)

        # Debugging: Check the extracted text
        print("Extracted text:", text)

        return jsonify({"text": text if text else "No text extracted"})
    except Exception as e:
        print("error:", e)
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
  app.run(debug=True)



