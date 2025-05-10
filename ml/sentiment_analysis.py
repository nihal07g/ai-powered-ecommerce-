import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import pickle
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download NLTK resources
nltk.download('stopwords')
nltk.download('wordnet')

# Sample training data
sample_reviews = [
    "This product is amazing! I love it so much.",
    "Great quality and fast delivery. Very satisfied.",
    "Works perfectly. Exactly what I needed.",
    "Not worth the money. Disappointed with the quality.",
    "Terrible product. Broke after one week.",
    "Waste of money. Don't buy this.",
    "Decent product for the price.",
    "It's okay, nothing special.",
    "Average quality but good value.",
    "Absolutely love this product! Best purchase ever!",
    "Very disappointed with this purchase.",
    "The product arrived damaged and customer service was unhelpful.",
    "Good product but a bit overpriced.",
    "Excellent value for money. Highly recommend.",
    "It's fine but I expected better quality."
]

# Labels: 0 = negative, 1 = neutral, 2 = positive
sample_labels = [2, 2, 2, 0, 0, 0, 1, 1, 1, 2, 0, 0, 1, 2, 1]

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

# Preprocess the sample reviews
processed_reviews = [preprocess_text(review) for review in sample_reviews]

# Create TF-IDF features
vectorizer = TfidfVectorizer(max_features=1000)
X = vectorizer.fit_transform(processed_reviews)
y = np.array(sample_labels)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a logistic regression model
model = LogisticRegression(max_iter=1000, C=1.0, solver='lbfgs', multi_class='multinomial')
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model accuracy: {accuracy:.2f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Negative', 'Neutral', 'Positive']))

# Function to predict sentiment of new reviews
def predict_sentiment(review_text):
    processed = preprocess_text(review_text)
    vectorized = vectorizer.transform([processed])
    prediction = model.predict(vectorized)[0]
    
    if prediction == 0:
        return "negative"
    elif prediction == 1:
        return "neutral"
    else:
        return "positive"

# Example usage
test_reviews = [
    "I'm very happy with this purchase!",
    "It's okay but not great.",
    "Terrible product, don't waste your money."
]

for review in test_reviews:
    sentiment = predict_sentiment(review)
    print(f"Review: '{review}' - Sentiment: {sentiment}")

# Save the model and vectorizer for later use
with open('sentiment_model.pkl', 'wb') as f:
    pickle.dump(model, f)
    
with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

print("\nModel and vectorizer saved successfully.")
