from http.server import BaseHTTPRequestHandler
import os
import json
from load_dataset import main as load_dataset

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Check for authorization token
        auth_header = self.headers.get('Authorization')
        expected_token = os.environ.get('DATASET_LOAD_TOKEN')
        
        if not expected_token or auth_header != f"Bearer {expected_token}":
            self.send_response(401)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Unauthorized"}).encode())
            return
        
        try:
            # Run the dataset loading process
            result = load_dataset()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_POST(self):
        # Same as GET but can be triggered by Vercel webhook
        self.do_GET()
