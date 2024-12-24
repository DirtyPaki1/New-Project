from flask import Flask, jsonify, request
from flask_cors import CORS  # Import the CORS module

app = Flask(__name__)

# Enable CORS for all routes with support for credentials (cookies)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

# Dummy data for fighters (Replace with a real database if needed)
fighters = [
    {"id": 1, "name": "Ryu"},
    {"id": 2, "name": "Ken"},
    {"id": 3, "name": "Chun Li"},
]

@app.route('/fighters', methods=['GET'])
def get_fighters():
    """Fetch all fighters"""
    return jsonify(fighters)

@app.route('/fighter', methods=['POST'])
def add_fighter():
    """Add a new fighter"""
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"error": "Fighter name is required"}), 400

    new_fighter = {"id": len(fighters) + 1, "name": name}
    fighters.append(new_fighter)
    return jsonify(new_fighter), 201

@app.route('/fighter/<int:id>', methods=['DELETE'])
def delete_fighter(id):
    """Delete a specific fighter by ID"""
    fighter_to_delete = next((fighter for fighter in fighters if fighter["id"] == id), None)
    if not fighter_to_delete:
        return jsonify({"error": "Fighter not found"}), 404

    fighters.remove(fighter_to_delete)
    return jsonify({"message": "Fighter deleted"}), 200

@app.route('/fighter/<int:id>/update', methods=['PUT'])
def update_fighter(id):
    """Update a fighter's name"""
    fighter_to_update = next((fighter for fighter in fighters if fighter["id"] == id), None)
    if not fighter_to_update:
        return jsonify({"error": "Fighter not found"}), 404

    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"error": "Updated name is required"}), 400

    fighter_to_update["name"] = name
    return jsonify(fighter_to_update)

@app.route('/fighters', methods=['DELETE'])
def delete_all_fighters():
    """Delete all fighters"""
    fighters.clear()
    return jsonify({"message": "All fighters deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  # Ensure it's running on port 5000
