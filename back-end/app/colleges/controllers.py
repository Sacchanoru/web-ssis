from flask import jsonify, request
from app.colleges.service_repo import CollegeService

class CollegeController:
    @staticmethod
    def get_all_colleges():
        search = request.args.get("search")
        filter_by = request.args.get("filter_by") or request.args.get("filterBy") or "none"
        sort_by = request.args.get("sort_by") or request.args.get("sortBy") or "code"
        order = request.args.get("order") or request.args.get("sort") or "asc"

        # pagination
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))

        colleges = CollegeService.get_all_colleges(
            search, filter_by, sort_by, order, page, per_page
        )
        return jsonify(colleges), 200

    @staticmethod
    def create_college(data):
        code = data.get("code")
        name = data.get("name")

        if not code or not name:
            return jsonify({"error": "Missing code or name"}), 400

        college = CollegeService.create_college(code, name)
        return jsonify(college), 200
    
    @staticmethod
    def delete_college(code: str):
        college = CollegeService.delete_college(code)
        if not college:
            return jsonify({"error": "College not found"}), 400

        return jsonify({"message": f"College {college['code']} deleted successfully"}), 200
    
    @staticmethod
    def edit_college(code, data):
        updated = CollegeService.edit_college(code, data)
        if updated:
            return jsonify({"message": "College updated successfully", "college": updated}), 200
        return jsonify({"error": "College not found"}), 400
    
    @staticmethod
    def check_college_exists(code: str):
        exists = CollegeService.college_exists(code)
        return jsonify({"exists": exists}), 200
