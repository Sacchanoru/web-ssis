from app.database import get_db
from app.utils.pagination_help import paginate_query
from app.students.image_service import ImageService

class StudentService:
    @staticmethod
    def get_all_students(search=None, filter_by="none", sort_by="id", order="asc", page=1, per_page=10):
        db = get_db()
        cur = db.cursor()

        valid_columns = ("id", "firstname", "lastname", "course", "year", "gender")
        if filter_by not in (*valid_columns, "none"):
            filter_by = "none"
        if sort_by not in valid_columns:
            sort_by = "id"
        if order.lower() not in ("asc", "desc"):
            order = "asc"

        sql = """
            SELECT s.id, s.firstname, s.lastname, s.course, p.name AS program_name,
                   s.year, s.gender
            FROM student s
            LEFT JOIN program p ON s.course = p.code
        """
        params = []

        # search filters
        if search:
            if filter_by == "none":
                sql += """
                    WHERE s.id ILIKE %s
                       OR s.firstname ILIKE %s
                       OR s.lastname ILIKE %s
                       OR s.course ILIKE %s
                       OR p.name ILIKE %s
                       OR s.gender ILIKE %s
                       OR CAST(s.year AS TEXT) ILIKE %s
                """
                params = [f"%{search}%"] * 7
            elif filter_by == "course":
                sql += " WHERE s.course ILIKE %s OR p.name ILIKE %s"
                params = [f"%{search}%", f"%{search}%"]
            elif filter_by == "year":
                sql += " WHERE CAST(s.year AS TEXT) ILIKE %s"
                params = [f"%{search}%"]
            else:
                sql += f" WHERE s.{filter_by} ILIKE %s"
                params = [f"%{search}%"]

        sql += f" ORDER BY s.{sort_by} {order.upper()}"
        print("→ SQL:", cur.mogrify(sql, params).decode())
        result = paginate_query(cur, sql, params, page, per_page)

        merged_data = []
        for r in result["data"]:
            student_id = r[0]
            image_record = ImageService.get_student_image(student_id)
            image_url = image_record["supabase_public_url"] if image_record else None

            merged_data.append({
                "id": r[0],
                "firstname": r[1],
                "lastname": r[2],
                "course": r[3],
                "program_name": r[4],
                "year": r[5],
                "gender": r[6],
                "image_url": image_url
            })

        cur.close()
        result["data"] = merged_data
        return result

    @staticmethod
    def create_student(id, firstname, lastname, course=None, year=None, gender=None):
        db = get_db()
        cur = db.cursor()
        sql = """
            INSERT INTO student (id, firstname, lastname, course, year, gender)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cur.execute(sql, (id, firstname, lastname, course, year, gender))
        db.commit()
        cur.close()
        return {
            "id": id,
            "firstname": firstname,
            "lastname": lastname,
            "course": course,
            "year": year,
            "gender": gender,
        }

    @staticmethod
    def delete_student(student_id: str):
        db = get_db()
        cur = db.cursor()
        sql = """
            DELETE FROM student
            WHERE id = %s
            RETURNING id, firstname, lastname, course, year, gender
        """
        cur.execute(sql, (student_id,))
        deleted = cur.fetchone()
        db.commit()
        cur.close()

        try:
            from app.students.image_service import ImageService
            ImageService.delete_student_image(student_id)
        except Exception as e:
            print(f"Warning: failed to delete Supabase image: {str(e)}")

        if deleted:
            return {
                "id": deleted[0],
                "firstname": deleted[1],
                "lastname": deleted[2],
                "course": deleted[3],
                "year": deleted[4],
                "gender": deleted[5],
            }
        return None

    @staticmethod
    def edit_student(student_id, data):
        db = get_db()
        cur = db.cursor()

        cur.execute("""
            SELECT id, firstname, lastname, course, year, gender
            FROM student WHERE id = %s
        """, (student_id,))
        row = cur.fetchone()

        if not row:
            cur.close()
            return None

        new_id = data.get("id", row[0])
        new_firstname = data.get("firstname", row[1])
        new_lastname = data.get("lastname", row[2])
        new_course = data.get("course", row[3])
        new_year = data.get("year", row[4])
        new_gender = data.get("gender", row[5])

        sql = """
            UPDATE student
            SET id = %s, firstname = %s, lastname = %s, course = %s, year = %s, gender = %s
            WHERE id = %s
            RETURNING id, firstname, lastname, course, year, gender
        """

        cur.execute(sql, (
            new_id, new_firstname, new_lastname, new_course,
            new_year, new_gender, student_id
        ))

        updated = cur.fetchone()
        db.commit()
        cur.close()

        # -----------------------------------------------------
        # FIX: Move image if the student ID changes
        # -----------------------------------------------------
        if updated and student_id != new_id:
            try:
                ImageService.move_student_image(student_id, new_id)
            except Exception as e:
                print("Warning: could not move image:", e)
        # -----------------------------------------------------

        if updated:
            return {
                "id": updated[0],
                "firstname": updated[1],
                "lastname": updated[2],
                "course": updated[3],
                "year": updated[4],
                "gender": updated[5],
            }

        return None

    @staticmethod
    def student_exists(student_id: str) -> bool:
        db = get_db()
        cur = db.cursor()
        sql = "SELECT EXISTS(SELECT 1 FROM student WHERE id = %s)"
        cur.execute(sql, (student_id,))
        exists = cur.fetchone()[0]
        cur.close()
        return exists
