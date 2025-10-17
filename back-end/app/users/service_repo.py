import hashlib
import jwt
import datetime
from app.database import get_db
from flask import current_app

class UserService:
    @staticmethod
    def register_user(data):
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")

        if not username or not password or not email:
            raise Exception("Missing fields")

        db = get_db()
        cur = db.cursor()

        cur.execute("SELECT id FROM users WHERE username = %s", (username,))
        if cur.fetchone():
            raise Exception("Username already exists")

        password_hash = hashlib.md5(password.encode()).hexdigest()
        cur.execute(
            "INSERT INTO users (username, user_password, email) VALUES (%s, %s, %s) RETURNING id",
            (username, password_hash, email)
        )
        user_id = cur.fetchone()[0]
        db.commit()
        cur.close()

        return {"id": user_id, "username": username, "email": email}

    @staticmethod
    def login_user(data):
        username = data.get("username")
        password = data.get("password")

        db = get_db()
        cur = db.cursor()
        cur.execute("SELECT id, username, user_password, email FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        cur.close()

        if not user:
            raise Exception("User not found")

        password_hash = hashlib.md5(password.encode()).hexdigest()
        if user[2] != password_hash:
            raise Exception("Invalid password")

        token = jwt.encode({
            "id": user[0],
            "username": user[1],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=3)
        }, current_app.config["SECRET_KEY"], algorithm="HS256")

        return {"token": token, "user": {"id": user[0], "username": user[1], "email": user[3]}}

    @staticmethod
    def get_current_user(token):
        try:
            decoded = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise Exception("Token expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")

        db = get_db()
        cur = db.cursor()
        cur.execute("SELECT id, username, email FROM users WHERE id = %s", (decoded["id"],))
        user = cur.fetchone()
        cur.close()

        if not user:
            raise Exception("User not found")

        return {"id": user[0], "username": user[1], "email": user[2]}
