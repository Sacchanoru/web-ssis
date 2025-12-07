from app.database import get_db
from app.utils.pagination_help import paginate_query

class ProgramService:
    @staticmethod
    def get_all_programs(search=None, filter_by="none", sort_by="code", order="asc", page=1, per_page=10):
        db = get_db()
        cur = db.cursor()

        valid_columns = ("code", "name", "college_code")
        if filter_by not in (*valid_columns, "none"):
            filter_by = "none"
        if sort_by not in valid_columns:
            sort_by = "code"
        if order.lower() not in ("asc", "desc"):
            order = "asc"

        # program with left join college to show college name
        sql = """
            SELECT p.code, p.name, p.college_code, c.name AS college_name
            FROM program p
            LEFT JOIN college c ON p.college_code = c.code
        """
        params = []

        # search
        if search:
            if filter_by == "none":
                sql += " WHERE p.code ILIKE %s OR p.name ILIKE %s OR c.name ILIKE %s"
                params = [f"%{search}%", f"%{search}%", f"%{search}%"]
            elif filter_by == "college_code":
                sql += " WHERE p.college_code ILIKE %s"
                params = [f"%{search}%"]
            else:
                sql += f" WHERE p.{filter_by} ILIKE %s"
                params = [f"%{search}%"]

        sql += f" ORDER BY p.{sort_by} {order.upper()}"

        # debug testing
        print("→ SQL:", cur.mogrify(sql, params).decode())

        # pagination
        result = paginate_query(cur, sql, params, page, per_page)
        result["data"] = [
            {
                "code": r[0],
                "name": r[1],
                "college_code": r[2],
                "college_name": r[3],
            }
            for r in result["data"]
        ]

        cur.close()
        return result

    @staticmethod
    def create_program(code, name, college_code=None):
        db = get_db()
        cur = db.cursor()
        sql = "INSERT INTO program (code, name, college_code) VALUES (%s, %s, %s)"
        cur.execute(sql, (code, name, college_code))
        db.commit()
        cur.close()
        return {"code": code, "name": name, "college_code": college_code}

    @staticmethod
    def delete_program(code: str):
        db = get_db()
        cur = db.cursor()
        sql = "DELETE FROM program WHERE code = %s RETURNING code, name, college_code"
        cur.execute(sql, (code,))
        deleted = cur.fetchone()
        db.commit()
        cur.close()
        if deleted:
            return {
                "code": deleted[0],
                "name": deleted[1],
                "college_code": deleted[2],
            }
        return None

    @staticmethod
    def edit_program(code, data):
        db = get_db()
        cur = db.cursor()

        cur.execute("SELECT code, name, college_code FROM program WHERE code = %s", (code,))
        row = cur.fetchone()
        if not row:
            cur.close()
            return None

        new_code = data.get("code", row[0])
        new_name = data.get("name", row[1])
        new_college_code = data.get("college_code", row[2])

        sql = """
            UPDATE program
            SET code = %s, name = %s, college_code = %s
            WHERE code = %s
            RETURNING code, name, college_code
        """
        cur.execute(sql, (new_code, new_name, new_college_code, code))
        updated = cur.fetchone()
        db.commit()
        cur.close()
        if updated:
            return {
                "code": updated[0],
                "name": updated[1],
                "college_code": updated[2],
            }
        return None

    @staticmethod
    def program_exists(code: str) -> bool:
        db = get_db()
        cur = db.cursor()
        sql = "SELECT EXISTS(SELECT 1 FROM program WHERE code = %s)"
        cur.execute(sql, (code,))
        exists = cur.fetchone()[0]
        cur.close()
        return exists

    @staticmethod
    def get_all_programs_unpaginated(sort_by="code", order="asc"):
        db = get_db()
        cur = db.cursor()

        valid_columns = ("code", "name", "college_code")
        if sort_by not in valid_columns:
            sort_by = "code"
        if order.lower() not in ("asc", "desc"):
            order = "asc"

        sql = f"""
            SELECT p.code, p.name, p.college_code, c.name AS college_name
            FROM program p
            LEFT JOIN college c ON p.college_code = c.code
            ORDER BY p.{sort_by} {order.upper()}
        """
        
        cur.execute(sql)
        results = cur.fetchall()

        programs = [
            {
                "code": r[0],
                "name": r[1],
                "college_code": r[2],
                "college_name": r[3],
            }
            for r in results
        ]

        cur.close()
        return programs