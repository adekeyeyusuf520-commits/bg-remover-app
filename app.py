from flask import Flask, request, send_file
from rembg import remove
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow frontend requests

@app.route("/remove-bg", methods=["POST"])
def remove_bg():
    if "image" not in request.files:
        return {"error": "No image uploaded"}, 400

    file = request.files["image"]
    input_image = Image.open(file)

    output_image = remove(input_image)

    buffer = io.BytesIO()
    output_image.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype="image/png")

if __name__ == "__main__":
    app.run(debug=True)