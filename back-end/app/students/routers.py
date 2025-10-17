from flask import Blueprint, request, jsonify
from app.students.controllers import StudentController

student_bp = Blueprint("student", __name__, url_prefix="/students")

@student_bp.route("/", methods=["GET"])
def get_students():
    return StudentController.get_all_students()

@student_bp.route("/", methods=["POST"])
def create_student():
    try:
        data = request.json
        return StudentController.create_student(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@student_bp.route("/<string:student_id>", methods=["DELETE"])
def delete_student(student_id):
    try:
        return StudentController.delete_student(student_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@student_bp.route("/<string:student_id>", methods=["PUT"])
def edit_student(student_id):
    try:
        data = request.json
        return StudentController.edit_student(student_id, data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@student_bp.route("/exists/<string:student_id>", methods=["GET"])
def check_student_exists(student_id):
    return StudentController.check_student_exists(student_id)