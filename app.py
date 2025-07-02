from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

FEEDBACK_FILE = 'feedback.json'

# Serve the index.html page
@app.route('/')
def home():
    return render_template('index.html')  # Loads from /templates/index.html


@app.route('/submit', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()

        # Load existing feedback if file exists
        if os.path.exists(FEEDBACK_FILE):
            with open(FEEDBACK_FILE, 'r') as f:
                feedback_list = json.load(f)
        else:
            feedback_list = []

        # Add new feedback to list
        feedback_list.append(data)

        # Save updated feedback list
        with open(FEEDBACK_FILE, 'w') as f:
            json.dump(feedback_list, f, indent=4)

        return jsonify({'message': 'Feedback submitted successfully!'}), 200

    except Exception as e:
        print(f"Error saving feedback: {e}")
        return jsonify({'message': 'Failed to save feedback'}), 500


@app.route('/admin/feedback', methods=['GET'])
def get_feedback():
    try:
        with open(FEEDBACK_FILE, 'r') as f:
            feedback_list = json.load(f)
    except FileNotFoundError:
        feedback_list = []

    return jsonify(feedback_list)


if __name__ == '__main__':
    app.run(debug=True)
