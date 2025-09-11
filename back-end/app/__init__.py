from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/api/test", methods=["GET"])
    def test():
        return {"message": "test"}

    return app