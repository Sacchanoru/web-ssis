import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from app import database


def create_app():
    load_dotenv()

    app = Flask(__name__)

    # database config
    app.config["DATABASE_URL"] = (
        f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
        f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    )

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "fallback-secret")
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    database.init_app(app)

    from app.colleges.routers import college_bp
    from app.programs.routers import program_bp
    from app.students.routers import student_bp
    from app.users.routers import user_bp

    app.register_blueprint(college_bp)
    app.register_blueprint(program_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(user_bp)

    return app