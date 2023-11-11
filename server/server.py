import base64  # Add this import
from flask import Flask, request, jsonify
from rembg import remove
from PIL import Image
import tempfile
import requests
import io
import logging
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/process', methods=['POST'])
def process_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    try:
        # Verify that the file is an image (you can add more checks)
        if file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            input_image = Image.open(file)
            processed_image = remove(input_image)

            # Convert the processed image to base64
            with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as processed_temp_file:
                processed_image.save(processed_temp_file)
                with open(processed_temp_file.name, "rb") as img_file:
                    base64_image = base64.b64encode(
                        img_file.read()).decode('utf-8')

            return jsonify({'success': True, 'processed_image': base64_image})
        else:
            return jsonify({'error': 'Unsupported image format'})
    except Exception as e:
        print(str(e))
        return jsonify({'error': 'Error processing image'})


@app.route('/uploadUrl', methods=['POST'])
def upload_image_url():
    try:
        image_url = request.json.get('image_url')

        if not image_url:
            # Return a 400 Bad Request status
            return jsonify({'error': 'Image URL is required'}), 400

        # Fetch the image from the provided URL
        response = requests.get(image_url)

        if response.status_code == 200:
            image_data = response.content

            # Verify that the fetched data is an image (you can add more checks)
            if response.headers.get('Content-Type', '').startswith('image'):
                input_image = Image.open(io.BytesIO(image_data))
                processed_image = remove(input_image)  # Remove background

                # Convert the processed image to base64
                with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as processed_temp_file:
                    processed_image.save(processed_temp_file)
                    with open(processed_temp_file.name, "rb") as img_file:
                        base64_image = base64.b64encode(
                            img_file.read()).decode('utf-8')

                return jsonify({'success': True, 'processed_image': base64_image})

            else:
                return jsonify({'error': 'Unsupported image format'}), 400

        else:
            return jsonify({'error': 'Failed to fetch the image'}), 404

    except Exception as e:
        logging.error(f'Error processing image: {str(e)}')
        return jsonify({'error': 'Error processing image'}), 500


if __name__ == '__main__':
    app.run(debug=True)
