import os
import json
import requests
import subprocess
import pymongo
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('dataset_loader')

# Environment variables
MONGODB_URI = os.environ.get('MONGODB_URI')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyDwI267SUSomsiXOioCQZ6LnkXPLEvQuz8')
PROJECT_NUMBER = os.environ.get('PROJECT_NUMBER', '105701591987')
REPO_URL = "https://github.com/luminati-io/eCommerce-dataset-samples.git"
DATA_DIR = Path("data")

def clone_repository():
    """Clone the dataset repository if it doesn't exist."""
    if not DATA_DIR.exists():
        logger.info(f"Cloning repository: {REPO_URL}")
        subprocess.run(["git", "clone", REPO_URL, DATA_DIR], check=True)
    else:
        logger.info("Repository already exists, pulling latest changes")
        subprocess.run(["git", "-C", DATA_DIR, "pull"], check=True)

def connect_to_mongodb() -> pymongo.MongoClient:
    """Connect to MongoDB using the connection string."""
    if not MONGODB_URI:
        raise ValueError("MONGODB_URI environment variable is not set")
    
    logger.info("Connecting to MongoDB")
    client = pymongo.MongoClient(MONGODB_URI)
    return client

def parse_json_files() -> List[Dict[str, Any]]:
    """Parse all JSON files in the data directory."""
    products = []
    json_files = list(DATA_DIR.glob("**/*.json"))
    
    logger.info(f"Found {len(json_files)} JSON files to process")
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # Handle different JSON structures
                if isinstance(data, list):
                    products.extend(data)
                elif isinstance(data, dict):
                    if 'products' in data:
                        products.extend(data['products'])
                    else:
                        products.append(data)
        except Exception as e:
            logger.error(f"Error parsing {json_file}: {e}")
    
    logger.info(f"Parsed {len(products)} products from JSON files")
    return products

def transform_product(product: Dict[str, Any]) -> Dict[str, Any]:
    """Transform a product record to match our MongoDB schema."""
    # Extract fields with fallbacks
    asin = product.get('asin') or product.get('id') or str(hash(product.get('title', '')))
    
    # Handle different price formats
    price_raw = product.get('price')
    price = 0
    if isinstance(price_raw, (int, float)):
        price = price_raw
    elif isinstance(price_raw, str):
        # Remove currency symbols and convert to float
        price_str = price_raw.replace('$', '').replace('₹', '').replace(',', '')
        try:
            price = float(price_str)
            # Convert to INR if in USD (assuming $ symbol means USD)
            if '$' in price_raw:
                price = price * 75  # Approximate USD to INR conversion
        except ValueError:
            price = 0
    
    # Extract categories
    categories = []
    if 'categories' in product:
        if isinstance(product['categories'], list):
            categories = product['categories']
        elif isinstance(product['categories'], str):
            categories = [product['categories']]
    
    # Determine main category
    main_category = 'other'
    category_keywords = {
        'mobile': ['phone', 'mobile', 'smartphone', 'cell phone', 'tablet'],
        'laptop': ['laptop', 'notebook', 'computer', 'pc'],
        'clothing': ['shirt', 'dress', 't-shirt', 'pants', 'jeans', 'clothing', 'apparel']
    }
    
    for cat in categories:
        cat_lower = cat.lower()
        for key, keywords in category_keywords.items():
            if any(keyword in cat_lower for keyword in keywords):
                main_category = key
                break
    
    # Extract image URLs
    image_urls = []
    if 'images' in product and isinstance(product['images'], list):
        image_urls = [img.get('url') or img for img in product['images'] if isinstance(img, dict) and 'url' in img or isinstance(img, str)]
    elif 'image' in product:
        if isinstance(product['image'], str):
            image_urls = [product['image']]
        elif isinstance(product['image'], dict) and 'url' in product['image']:
            image_urls = [product['image']['url']]
    
    # Extract reviews
    reviews = []
    if 'reviews' in product and isinstance(product['reviews'], list):
        for review in product['reviews']:
            if isinstance(review, dict):
                reviews.append({
                    'id': review.get('id', str(hash(review.get('text', '')))),
                    'name': review.get('username', 'Anonymous'),
                    'comment': review.get('text', ''),
                    'rating': review.get('rating', 5),
                    'date': review.get('date', ''),
                    'sentiment': 'neutral'  # Will be updated by Gemini
                })
    
    # Determine product type based on title and description
    product_type = 'other'
    title_lower = product.get('title', '').lower()
    desc_lower = product.get('description', '').lower()
    
    type_keywords = {
        'smartphone': ['smartphone', 'iphone', 'galaxy', 'pixel', 'oneplus'],
        'tablet': ['tablet', 'ipad', 'galaxy tab'],
        'gaming': ['gaming', 'game', 'rtx', 'nvidia', 'amd'],
        'business': ['business', 'office', 'professional', 'work'],
        'casual': ['casual', 't-shirt', 'jeans', 'everyday'],
        'formal': ['formal', 'dress', 'suit', 'office wear']
    }
    
    for key, keywords in type_keywords.items():
        if any(keyword in title_lower for keyword in keywords) or any(keyword in desc_lower for keyword in keywords):
            product_type = key
            break
    
    # Determine color if available
    color = 'unknown'
    color_keywords = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'gray', 'silver', 'gold']
    
    for c in color_keywords:
        if c in title_lower or c in desc_lower:
            color = c
            break
    
    # Create transformed product
    transformed = {
        'id': asin,
        'name': product.get('title', ''),
        'description': product.get('description', ''),
        'price': int(price),  # Convert to integer for INR
        'category': main_category,
        'type': product_type,
        'color': color,
        'brand': product.get('brand', ''),
        'image': image_urls[0] if image_urls else None,
        'additionalImages': image_urls[1:] if len(image_urls) > 1 else [],
        'stock': product.get('stock', 50),  # Default stock
        'reviews': reviews
    }
    
    return transformed

def upload_to_mongodb(products: List[Dict[str, Any]], client: pymongo.MongoClient):
    """Upload transformed products to MongoDB."""
    db = client.get_default_database()
    collection = db['products']
    
    # Create index for faster lookups
    collection.create_index([('id', pymongo.ASCENDING)], unique=True)
    
    # Bulk upsert
    operations = []
    for product in products:
        operations.append(
            pymongo.UpdateOne(
                {'id': product['id']},
                {'$set': product},
                upsert=True
            )
        )
    
    # Execute in batches to avoid hitting MongoDB limits
    batch_size = 100
    for i in range(0, len(operations), batch_size):
        batch = operations[i:i+batch_size]
        result = collection.bulk_write(batch)
        logger.info(f"Batch {i//batch_size + 1}: {result.upserted_count} inserted, {result.modified_count} modified")

def enrich_with_gemini(client: pymongo.MongoClient):
    """Enrich product data with Gemini AI."""
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not set, skipping enrichment")
        return
    
    db = client.get_default_database()
    collection = db['products']
    
    # Get products without AI summaries
    products_to_enrich = list(collection.find(
        {'aiSummary': {'$exists': False}},
        {'id': 1, 'name': 1, 'description': 1}
    ).limit(50))  # Process in batches
    
    logger.info(f"Enriching {len(products_to_enrich)} products with Gemini")
    
    for product in products_to_enrich:
        try:
            # Call Gemini API
            prompt = f"""
            Product Name: {product['name']}
            Product Description: {product['description']}
            
            Please provide:
            1. A concise summary of this product (2-3 sentences)
            2. Key features (as a JSON array)
            3. Pros and cons (as JSON objects with arrays)
            4. Best use cases (as a JSON array)
            
            Format the response as valid JSON with the following structure:
            {{
                "summary": "string",
                "features": ["feature1", "feature2", ...],
                "pros": ["pro1", "pro2", ...],
                "cons": ["con1", "con2", ...],
                "useCases": ["useCase1", "useCase2", ...]
            }}
            """
            
            response = requests.post(
                f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}",
                headers={
                    "Content-Type": "application/json",
                    "x-goog-user-project": PROJECT_NUMBER
                },
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.2,
                        "maxOutputTokens": 1024
                    }
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                text = data['candidates'][0]['content']['parts'][0]['text']
                
                # Extract JSON from response
                import re
                json_match = re.search(r'({.*})', text, re.DOTALL)
                if json_match:
                    ai_data = json.loads(json_match.group(1))
                    
                    # Update product with AI data
                    collection.update_one(
                        {'id': product['id']},
                        {'$set': {
                            'aiSummary': ai_data.get('summary', ''),
                            'features': ai_data.get('features', []),
                            'pros': ai_data.get('pros', []),
                            'cons': ai_data.get('cons', []),
                            'useCases': ai_data.get('useCases', [])
                        }}
                    )
                    logger.info(f"Enriched product {product['id']}")
                else:
                    logger.warning(f"Could not extract JSON from Gemini response for product {product['id']}")
            else:
                logger.warning(f"Gemini API error: {response.status_code} - {response.text}")
            
            # Rate limiting to avoid API quota issues
            time.sleep(1)
            
        except Exception as e:
            logger.error(f"Error enriching product {product['id']}: {e}")

def main():
    """Main function to run the data loading process."""
    try:
        logger.info("Starting dataset loading process")
        
        # Clone repository
        clone_repository()
        
        # Connect to MongoDB
        client = connect_to_mongodb()
        
        # Parse JSON files
        raw_products = parse_json_files()
        
        # Transform products
        transformed_products = [transform_product(p) for p in raw_products]
        
        # Upload to MongoDB
        upload_to_mongodb(transformed_products, client)
        
        # Enrich with Gemini
        enrich_with_gemini(client)
        
        logger.info("Dataset loading process completed successfully")
        return {"status": "success", "message": "Dataset loaded successfully", "count": len(transformed_products)}
        
    except Exception as e:
        logger.error(f"Error in dataset loading process: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    main()
