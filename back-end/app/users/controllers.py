from flask import jsonify
from app.users.service_repo import UserService

class UserController:

    print("✅ Loaded UserController from:", __file__)

    @staticmethod
    def register_user(data):
        try:
            result = UserService.register_user(data)
            return jsonify(result), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @staticmethod
    def login_user(data):
        try:
            result = UserService.login_user(data)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @staticmethod
    def get_current_user(token):
        try:
            result = UserService.get_current_user(token)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400