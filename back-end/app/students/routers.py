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

@student_bp.route("/<string:student_id>/details", methods=["GET"])
def get_student_with_image(student_id):
    """Get full student details with image"""
    return StudentController.get_student_with_image(student_id)

@student_bp.route("/<string:student_id>/image", methods=["POST"])
def upload_student_image(student_id):
    """Upload or update student image"""
    return StudentController.upload_student_image(student_id)

@student_bp.route("/<string:student_id>/image", methods=["GET"])
def get_student_image(student_id):
    """Get student image info"""
    return StudentController.get_student_image(student_id)

@student_bp.route("/<string:student_id>/image", methods=["DELETE"])
def delete_student_image(student_id):
    """Delete student image only"""
    return StudentController.delete_student_image_only(student_id)