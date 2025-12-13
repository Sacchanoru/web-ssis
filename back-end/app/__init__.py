import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from app import database

def create_app():
    load_dotenv()

    base_dir = os.path.dirname(os.path.abspath(__file__))    
    back_end_dir = os.path.dirname(base_dir)               
    project_root = os.path.dirname(back_end_dir)    
    static_folder = os.path.join(project_root, 'back-end', 'dist')

    app = Flask(__name__, static_folder=static_folder, static_url_path=None)

    print("Serving React build from:", static_folder)
    if os.path.exists(static_folder):
        print("Contents:", os.listdir(static_folder))
    else:
        print("Folder not found! Run `npm run build` in back-end.")

    app.config["DATABASE_URL"] = (
        f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
        f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    )
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "fallback-secret")

    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    database.init_app(app)

    from app.colleges.routers import college_bp
    from app.programs.routers import program_bp
    from app.students.routers import student_bp
    from app.users.routers import user_bp

    app.register_blueprint(college_bp, url_prefix="/api/colleges")
    app.register_blueprint(program_bp, url_prefix="/api/programs")
    app.register_blueprint(student_bp, url_prefix="/api/students")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path):   
        if path.startswith("api/"):
            return "API route not found", 404
        
        file_path = os.path.join(app.static_folder, path)
        
        if os.path.isfile(file_path):
            print(f">>> Serving file: {path}")
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, "index.html")

    return app