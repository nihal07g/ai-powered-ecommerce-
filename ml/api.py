from flask import Flask, request, jsonify
import pickle
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)

# Download NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')

# Load the model and vectorizer
try:
    with open('sentiment_model.pkl', 'rb') as f:
        model = pickle.load(f)
        
    with open('vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
    
    print("Model and vectorizer loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    # If loading fails, we'll train a simple model on the fly
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    import numpy as np
    
    # Simple training data
    sample_reviews = [
        "This product is amazing! I love it so much.",
        "Great quality and fast delivery. Very satisfied.",
        "Works perfectly. Exactly what I needed.",
        "Not worth the money. Disappointed with the quality.",
        "Terrible product. Broke after one week.",
        "Waste of money. Don't buy this.",
        "Decent product for the price.",
        "It's okay, nothing special.",
        "Average quality but good value."
    ]
    
    # Labels: 0 = negative, 1 = neutral, 2 = positive
    sample_labels = [2, 2, 2, 0, 0, 0, 1, 1, 1]
    
    # Create TF-IDF features
    vectorizer = TfidfVectorizer(max_features=1000)
    X = vectorizer.fit_transform(sample_reviews)
    y = np.array(sample_labels)
    
    # Train a simple model
    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)
    print("Fallback model trained successfully")

# Text preprocessing function
def preprocess_text(text):
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Tokenize
    tokens = text.split()
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    
    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    
    # Join tokens back into text
    processed_text = ' '.join(tokens)
    
    return processed_text

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    data = request.json
    
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    review_text = data['text']
    
    try:
        # Preprocess the text
        processed = preprocess_text(review_text)
        
        # Vectorize
        vectorized = vectorizer.transform([processed])
        
        # Predict
        prediction = model.predict(vectorized)[0]
        
        # Map prediction to sentiment
        sentiment_map = {0: 'negative', 1: 'neutral', 2: 'positive'}
        sentiment = sentiment_map.get(prediction, 'neutral')
        
        return jsonify({'sentiment': sentiment})
    
    except Exception as e:
        print(f"Error in sentiment analysis: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
