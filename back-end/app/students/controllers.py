from flask import jsonify, request
from app.students.service_repo import StudentService

class StudentController:
    @staticmethod
    def get_all_students():
        search = request.args.get("search")
        filter_by = request.args.get("filter_by") or request.args.get("filterBy") or "none"
        sort_by = request.args.get("sort_by") or request.args.get("sortBy") or "id"
        order = request.args.get("order") or request.args.get("sort") or "asc"

        # pagination
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))

        students = StudentService.get_all_students(
            search, filter_by, sort_by, order, page, per_page
        )
        return jsonify(students), 200

    @staticmethod
    def create_student(data):
        student_id = data.get("id")
        firstname = data.get("firstname")
        lastname = data.get("lastname")
        course = data.get("course")
        year = data.get("year")
        gender = data.get("gender")

        if not student_id or not firstname or not lastname:
            return jsonify({"error": "Missing required fields (id, firstname, lastname)"}), 400

        student = StudentService.create_student(student_id, firstname, lastname, course, year, gender)
        return jsonify(student), 200

    @staticmethod
    def delete_student(student_id: str):
        student = StudentService.delete_student(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 400

        return jsonify({"message": f"Student {student['id']} deleted successfully"}), 200

    @staticmethod
    def edit_student(student_id, data):
        updated = StudentService.edit_student(student_id, data)
        if updated:
            return jsonify({
                "message": "Student updated successfully",
                "student": updated
            }), 200
        return jsonify({"error": "Student not found"}), 400

    @staticmethod
    def check_student_exists(student_id: str):
        exists = StudentService.student_exists(student_id)
        return jsonify({"exists": exists}), 200