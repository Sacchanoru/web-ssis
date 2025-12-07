from flask import jsonify, request
from app.programs.service_repo import ProgramService

class ProgramController:
    @staticmethod
    def get_all_programs():
        search = request.args.get("search")
        filter_by = request.args.get("filter_by") or request.args.get("filterBy") or "none"
        sort_by = request.args.get("sort_by") or request.args.get("sortBy") or "code"
        order = request.args.get("order") or request.args.get("sort") or "asc"

        #pagination
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))

        programs = ProgramService.get_all_programs(
            search, filter_by, sort_by, order, page, per_page
        )
        return jsonify(programs), 200

    @staticmethod
    def create_program(data):
        code = data.get("code")
        name = data.get("name")
        college_code = data.get("college_code")

        if not code or not name:
            return jsonify({"error": "Missing code or name"}), 400

        program = ProgramService.create_program(code, name, college_code)
        return jsonify(program), 200

    @staticmethod
    def delete_program(code: str):
        program = ProgramService.delete_program(code)
        if not program:
            return jsonify({"error": "Program not found"}), 400

        return jsonify({"message": f"Program {program['code']} deleted successfully"}), 200

    @staticmethod
    def edit_program(code, data):
        updated = ProgramService.edit_program(code, data)
        if updated:
            return jsonify({
                "message": "Program updated successfully",
                "program": updated
            }), 200
        return jsonify({"error": "Program not found"}), 400

    @staticmethod
    def check_program_exists(code: str):
        exists = ProgramService.program_exists(code)
        return jsonify({"exists": exists}), 200
    
    @staticmethod
    def get_all_programs_unpaginated():
        sort_by = request.args.get("sort_by") or request.args.get("sortBy") or "code"
        order = request.args.get("order") or request.args.get("sort") or "asc"
        
        programs = ProgramService.get_all_programs_unpaginated(sort_by, order)
        return jsonify(programs), 200