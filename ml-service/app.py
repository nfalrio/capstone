from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from train_model import EmotionDetectionModel
import os

app = Flask(__name__)
CORS(app)

# Initialize model
sentiment_model = EmotionDetectionModel()

# Load trained model
model_path = 'model/emotion_detection_model'
if os.path.exists(f'{model_path}_tf'):
    try:
        sentiment_model.load_model(model_path)
        print("✅ Model loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
else:
    print("⚠️ No trained model found. Please train the model first.")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'ML service is running'})

@app.route('/predict', methods=['POST'])
def predict_sentiment():
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text']
        
        if not text.strip():
            return jsonify({'error': 'Empty text provided'}), 400
        
        # Predict sentiment
        result = sentiment_model.predict_emotion(text)
        
        # Map sentiment to readable format
        sentiment_map = {
            'kesedihan': 'negatif',
            'kegembiraan': 'positif',
            'kemarahan': 'negatif',
            'ketakutan': 'negatif',
            'cinta': 'positif',
            'kejutan': 'netral',
            'sadness': 'negatif',
            'joy': 'positif',
            'anger': 'negatif',
            'fear': 'negatif',
            'love': 'positif',
            'surprise': 'netral',
        }
        
        readable_sentiment = sentiment_map.get(result['emotion'], 'netral')
        
        return jsonify({
            'success': True,
            'text': text,
            'sentiment': readable_sentiment,
            'confidence': result['confidence'],
            'probabilities': result['all_probabilities']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    try:
        data = request.get_json()
        
        if not data or 'texts' not in data:
            return jsonify({'error': 'No texts provided'}), 400
        
        texts = data['texts']
        results = []
        
        for text in texts:
            if text.strip():
                result = sentiment_model.predict_emotion(text)
                sentiment = result['emotion']
                confidence = result['confidence']
                sentiment_map = {
                    'kesedihan': 'negatif',
                    'kegembiraan': 'positif',
                    'kemarahan': 'negatif',
                    'ketakutan': 'negatif',
                    'cinta': 'positif',
                    'kejutan': 'netral',
                    'sadness': 'negatif',
                    'joy': 'positif',
                    'anger': 'negatif',
                    'fear': 'negatif',
                    'love': 'positif',
                    'surprise': 'netral',
                }
                readable_sentiment = sentiment_map.get(sentiment, 'netral')
                results.append({
                    'text': text,
                    'sentiment': readable_sentiment,
                    'confidence': confidence
                })
        
        return jsonify({
            'success': True,
            'results': results
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)