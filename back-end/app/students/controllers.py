from flask import jsonify, request
from app.students.service_repo import StudentService
from app.students.image_service import ImageService

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

        filter_year = request.args.get("filter_year")
        filter_program = request.args.get("filter_program")
        filter_gender = request.args.get("filter_gender")

        students = StudentService.get_all_students(
            search, filter_by, sort_by, order, page, per_page,
            filter_year, filter_program, filter_gender 
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
        ImageService.delete_student_image(student_id)  
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
    
    @staticmethod
    def upload_student_image(student_id: str):
        try:
            print(f"Student ID captured: {repr(student_id)}")
            if not StudentService.student_exists(student_id):
                return jsonify({"error": "Student not found"}), 404

            if 'image' not in request.files:
                return jsonify({"error": "No image file provided"}), 400
            
            file = request.files['image']
            
            if file.filename == '':
                return jsonify({"error": "No file selected"}), 400

            allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
            if not ('.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
                return jsonify({"error": "Invalid file type. Allowed: png, jpg, jpeg, gif"}), 400

            result = ImageService.upload_student_image(student_id, file)
            return jsonify(result), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def get_student_image(student_id: str):
        try:
            image_info = ImageService.get_student_image(student_id)
            
            if not image_info:
                return jsonify({"message": "No image found for this student"}), 404
            
            return jsonify(image_info), 200
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def delete_student_image_only(student_id: str):
        try:
            success = ImageService.delete_student_image(student_id)
            
            if success:
                return jsonify({"message": "Image deleted successfully"}), 200
            else:
                return jsonify({"error": "Failed to delete image"}), 500
                
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @staticmethod
    def get_student_with_image(student_id: str):
        try:
            student = StudentService.get_student_with_image(student_id)
            if not student:
                return jsonify({"error": "Student not found"}), 404
            return jsonify(student), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    @staticmethod
    def get_student_count_year_level(year: int):
        try:
            if year is None:
                return jsonify({"error": "Year is required"}), 400

            if not isinstance(year, int):
                return jsonify({"error": "Year must be an integer"}), 400

            if year < 1 or year > 6:
                return jsonify({"error": "Year must be between 1 and 6"}), 400

            count = StudentService.get_student_count_year_level(year)

            return jsonify({
                "year": year,
                "count": count
            }), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    @staticmethod
    def get_student_count_program(program_code: str = None):
        try:
            if not program_code:
                return jsonify({"error": "Program code is required"}), 400

            count = StudentService.get_student_count_program(program_code)
            return jsonify({
                "program_code": program_code,
                "count": count
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @staticmethod
    def get_student_count_gender(gender: str = None):
        try:
            if not gender:
                return jsonify({"error": "Gender is required"}), 400

            count = StudentService.get_student_count_gender(gender)
            return jsonify({
                "gender": gender,
                "count": count
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

