
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__,static_folder='../frontend/dist', static_url_path='/')
CORS(app, supports_credentials=True, allow_headers="*", origins="*", methods=["OPTIONS", "POST","GET"])
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

client = MongoClient('mongodb+srv://nagesh:nagesh2245@mywebsites.btvk61i.mongodb.net/')
db = client['Ventura']
teams_collection = db['teams']
buyers_collection = db['buyers']
        
@app.route('/api/teams', methods=['GET'])
def get_teams():
    teams_data = teams_collection.find()

    teams = []
    for team in teams_data:
        team['_id'] = str(team['_id'])
        teams.append(team)

    return jsonify({'status': 'success', 'teams': teams}), 200

@app.route('/api/login', methods=['POST'])
def login_buyer():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'success', 'message': 'CORS preflight request handled successfully'}), 200
    
    data = request.json
    buyer_name = data['name'].lower()
    pin = data['pin']

    buyer = buyers_collection.find_one({"name": buyer_name})
    
    if buyer is None:
        return jsonify({"error": "Buyer not found"}), 404
    
    if buyer['pin'] == pin:
        return jsonify({"status": "success", "message": "Login successful"}), 200
    
    return jsonify({"error": "Invalid PIN"}), 400

@app.route('/api/product/<product_id>', methods=['GET'])
def get_product(product_id):
    product = teams_collection.find_one({"product.name": product_id})
    print(product)
    if product is None:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({'status': 'success', 'Product': product['product']}), 200


@app.route('/api/buy', methods=['POST'])
def buy_product():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'success', 'message': 'CORS preflight request handled successfully'}), 200
    
    data = request.json
    buyer_name = data['name'].lower()
    price = float(data['price'])
    product_id = data['productId']
    pin = data['pin']
    
    product = teams_collection.find_one({"product.name": product_id})
    if not product:
        return jsonify({"error": "Product not found"}), 404
    
    product_details = product['product'] 

    buyer = buyers_collection.find_one({"name": buyer_name})
    if buyer['tokens'] < price:
        return jsonify({"message": "Not enough tokens"}), 400
    
    if buyer['pin'] != pin:
        return jsonify({"message": "incorrect PIN"}), 400

    if product_details in buyer.get('cart', []):
        return jsonify({"message": "Product already present in the cart"}), 400

    buyers_collection.update_one(
        {"name": buyer_name},
        {"$push": {"cart": product_details}, "$inc": {"tokens": -price}}
    )
    return jsonify({"message": "Product added to cart"}), 200

@app.route('/api/cart', methods=['POST'])
def get_cart():
    data = request.json
    buyer_name = data['buyername'].lower()
    buyer = buyers_collection.find_one({"name": buyer_name})
    
    if buyer is None:
        return jsonify({"error": "Buyer not found"}), 404

    cart_products = buyer.get('cart', [])
    
    return jsonify({"items": cart_products, "total": buyer['tokens']}), 200


if __name__ == '__main__':
    app.run(debug=True)
