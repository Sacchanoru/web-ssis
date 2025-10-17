from flask import Blueprint, request, jsonify
from app.colleges.controllers import CollegeController

college_bp = Blueprint("college", __name__, url_prefix="/colleges")

@college_bp.route("/", methods=["GET"])
def get_colleges():
    return CollegeController.get_all_colleges()

@college_bp.route("/", methods=["POST"])
def create_college():
    try:
        data = request.json
        return CollegeController.create_college(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@college_bp.route("/<string:code>", methods=["DELETE"])
def delete_college(code):
    try:
        return CollegeController.delete_college(code)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@college_bp.route("/<string:code>", methods=["PUT"])
def edit_college(code):
    try:
        data = request.json
        return CollegeController.edit_college(code, data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@college_bp.route("/exists/<string:code>", methods=["GET"])
def check_college_exists(code):
    return CollegeController.check_college_exists(code)