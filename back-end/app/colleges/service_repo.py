from app.database import get_db
from app.utils.pagination_help import paginate_query;

class CollegeService:
    @staticmethod
    def get_all_colleges(search=None, filter_by="none", sort_by="code", order="asc", page=1, per_page=10):
        db = get_db()
        cur = db.cursor()

        valid_columns = ("code", "name")
        if filter_by not in (*valid_columns, "none"):
            filter_by = "none"
        if sort_by not in valid_columns:
            sort_by = "code"
        if order.lower() not in ("asc", "desc"):
            order = "asc"

        sql = "SELECT code, name FROM college"
        params = []

        if search:
            if filter_by == "none":
                sql += " WHERE code ILIKE %s OR name ILIKE %s"
                params = [f"%{search}%", f"%{search}%"]
            else:
                sql += f" WHERE {filter_by} ILIKE %s"
                params = [f"%{search}%"]

        sql += f" ORDER BY {sort_by} {order.upper()}"

        # debug testing
        print("→ SQL:", cur.mogrify(sql, params).decode())

        # pagination
        result = paginate_query(cur, sql, params, page, per_page)
        result["data"] = [{"code": r[0], "name": r[1]} for r in result["data"]]
        cur.close()
        return result

    @staticmethod
    def create_college(code, name):
        db = get_db()
        cur = db.cursor()
        sql = "INSERT INTO college (code, name) VALUES (%s, %s)"
        cur.execute(sql, (code, name))
        db.commit()
        cur.close()
        return {"code": code, "name": name}

    @staticmethod
    def delete_college(code: str):
        db = get_db()
        cur = db.cursor()
        sql = "DELETE FROM college WHERE code = %s RETURNING code, name"
        cur.execute(sql, (code,))
        deleted = cur.fetchone()
        db.commit()
        cur.close()
        if deleted:
            return {"code": deleted[0], "name": deleted[1]}
        return None

    @staticmethod
    def edit_college(code, data):
        db = get_db()
        cur = db.cursor()

        # get current row
        cur.execute("SELECT code, name FROM college WHERE code = %s", (code,))
        row = cur.fetchone()
        if not row:
            cur.close()
            return None

        new_code = data.get("code", code)
        new_name = data.get("name", row[1])

        # Direct SQL UPDATE (this triggers ON UPDATE CASCADE in FK tables)
        sql = "UPDATE college SET code = %s, name = %s WHERE code = %s RETURNING code, name"
        cur.execute(sql, (new_code, new_name, code))
        updated = cur.fetchone()
        db.commit()
        cur.close()
        if updated:
            return {"code": updated[0], "name": updated[1]}
        return None

    @staticmethod
    def college_exists(code: str) -> bool:
        db = get_db()
        cur = db.cursor()
        sql = "SELECT EXISTS(SELECT 1 FROM college WHERE code = %s)"
        cur.execute(sql, (code,))
        exists = cur.fetchone()[0]
        cur.close()
        return exists