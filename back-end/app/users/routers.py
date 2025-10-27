from flask import Blueprint, request, jsonify
from app.users.controllers import UserController

user_bp = Blueprint("users", __name__, url_prefix="/users")

@user_bp.route("/register", methods=["POST"])
def register_user():
    data = request.json
    return UserController.register_user(data)

@user_bp.route("/login", methods=["POST"])
def login_user():
    data = request.json
    return UserController.login_user(data)

@user_bp.route("/me", methods=["GET"])
def get_current_user():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    return UserController.get_current_user(token)