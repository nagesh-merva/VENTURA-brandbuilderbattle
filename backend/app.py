from bson import ObjectId
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import random

app = Flask(__name__)
CORS(app, supports_credentials=True, allow_headers="*", origins="*", methods=["OPTIONS", "POST","GET"])
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

client = MongoClient('mongodb+srv://nagesh:nagesh2245@mywebsites.btvk61i.mongodb.net/')
db = client['Ventura']
teams_collection = db['teams']
buyers_collection = db['buyers']


@app.route('/')
def index():
    buyers = list(buyers_collection.find())
    
    return render_template('index.html', buyers=buyers)

@app.route('/api/add-team', methods=['POST'])
def add_team():
    team_data = request.json
    try:
        new_team = {
            "teamName": team_data["teamName"],
            "totalRevenue": team_data["totalRevenue"],
            "product": {
                "name": team_data["product"]["name"],
                "description": team_data["product"]["description"],
                "imageUrl": team_data["product"]["imageUrl"],
                "rating": team_data["product"]["rating"]
            }
        }
        result =teams_collection.insert_one(new_team)
        
        new_team["_id"] = str(result.inserted_id)
        
        return jsonify({"success": True, "team": new_team}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/edit-rating/<team_id>', methods=['PATCH'])
def edit_rating(team_id):
    try:
        new_rating = request.json.get("rating")
        if new_rating is None:
            return jsonify({"success": False, "message": "Rating is required"}), 400
        
        result = teams_collection.update_one(
            {"_id": ObjectId(team_id)},
            {"$set": {"product.rating": new_rating}}
        )

        if result.matched_count == 0:
            return jsonify({"success": False, "message": "Team not found"}), 404
        
        return jsonify({"success": True, "message": "Rating updated successfully"}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

        
@app.route('/api/getbuyers', methods=['GET'])
def getbuyer():
    buyers = list(buyers_collection.find())
    teams = list(teams_collection.find())
    
    teams = [{**team, "_id": str(team["_id"])} for team in teams]

    for buyer in buyers:
        buyer['_id'] = str(buyer['_id'])
        
        if 'cart' in buyer:
            for cart_item in buyer['cart']:
                product_name = cart_item['product']['name']
                product = teams_collection.find_one({"product.name": product_name})
                
                if product and 'rating' in product['product']:
                    cart_item['product']['rating'] = product['product']['rating']
                else:
                    cart_item['product']['rating'] = None
    
    return jsonify({"success": True, 'buyers': buyers, 'teams':teams }), 200

    
@app.route('/api/add-buyer', methods=['POST'])
def add_buyer():
    data = request.json

    existing_buyer = buyers_collection.find_one({"name": data['name']})
    if existing_buyer:
        return jsonify({"success": False, "message": "Buyer already exists"}), 400

    new_buyer = {
        "_id": ObjectId(),
        "id": "buyer" + str(random.randint(1, 1000)),
        "name": data['name'],
        "tokens": 150,
        "cart": [],
        "pin": data['pin']
    }
    new_buyer["_id"] = str(new_buyer["_id"])

    buyers_collection.insert_one(new_buyer)

    return jsonify({"success": True,'status': 'success', "buyer": new_buyer}), 200
        
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
        return jsonify({"message": "Product not found"}), 404
    
    product_details = product['product']
    cart_item = {
        "product": product_details,
        "price_paid": price
    }

    buyer = buyers_collection.find_one({"name": buyer_name})
    if not buyer:
        return jsonify({"message": "Buyer not found"}), 404
    
    if buyer['tokens'] < price:
        return jsonify({"message": "Not enough tokens"}), 400
    
    if buyer['pin'] != pin:
        return jsonify({"message": "Incorrect PIN"}), 400

    if cart_item in buyer.get('cart', []):
        return jsonify({"message": "Product already present in the cart"}), 400

    buyers_collection.update_one(
        {"name": buyer_name},
        {"$push": {"cart": cart_item}, "$inc": {"tokens": -price}}
    )

    teams_collection.update_one(
        {"product.name": product_id},
        {"$inc": {"totalRevenue": price}}
    )
    
    return jsonify({"message": "Product added to cart and revenue updated"}), 200


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
    app.run(host='0.0.0.0', port=8000,debug=True)
