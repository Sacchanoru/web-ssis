from flask import Blueprint, request, jsonify
from app.programs.controllers import ProgramController

program_bp = Blueprint("program", __name__, url_prefix="/programs")

@program_bp.route("/", methods=["GET"])
def get_programs():
    return ProgramController.get_all_programs()

@program_bp.route("/", methods=["POST"])
def create_program():
    try:
        data = request.json
        return ProgramController.create_program(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@program_bp.route("/<string:code>", methods=["DELETE"])
def delete_program(code):
    try:
        return ProgramController.delete_program(code)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@program_bp.route("/<string:code>", methods=["PUT"])
def edit_program(code):
    try:
        data = request.json
        return ProgramController.edit_program(code, data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@program_bp.route("/exists/<string:code>", methods=["GET"])
def check_program_exists(code):
    return ProgramController.check_program_exists(code)