from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging

load_dotenv()

db = SQLAlchemy()
cors = CORS()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class Config:
    """Base configuration"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    CORS_ORIGINS = ["http://localhost:3000"]

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    CORS_ORIGINS = ["https://yourdomain.com"]

def create_app():
    app = Flask(__name__)
    
    # Validate required environment variables
    required_env_vars = ['DATABASE_URL', 'JWT_SECRET_KEY', 'JWT_ALGORITHM', 'FLASK_ENV']
    for var in required_env_vars:
        if not os.getenv(var):
            raise ValueError(f"Missing required environment variable: {var}")
    
    # Load config based on environment
    flask_env = os.getenv('FLASK_ENV', 'development')
    if flask_env == 'production':
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)
    
    # Load configuration from environment variables
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ALGORITHM'] = os.getenv('JWT_ALGORITHM', 'HS256')
    app.config['ACCESS_TOKEN_EXPIRY'] = int(os.getenv('ACCESS_TOKEN_EXPIRY', 15))  # in minutes
    app.config['REFRESH_TOKEN_EXPIRY'] = int(os.getenv('REFRESH_TOKEN_EXPIRY', 7))   # in days
    
    # Initialize extensions
    db.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Import and register blueprints
    from app.routes import auth
    app.register_blueprint(auth.bp)

    # ===== ERROR HANDLERS =====
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"success": False, "error": 404, "message": "Resource not found"}), 404
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"success": False, "error": 400, "message": "Bad request"}), 400
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"success": False, "error": 500, "message": "Internal server error"}), 500
    
    @app.errorhandler(422)
    def unprocessable(error):
        return jsonify({"success": False, "error": 422, "message": "Unprocessable request"}), 422

    # Custom error handler for database errors
    @app.errorhandler(Exception)
    def handle_generic_error(error):
        logger.error(f"Unhandled error: {error}", exc_info=True)
        return jsonify({"success": False, "error": 500, "message": "Something went wrong"}), 500
    
    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({"status": "ok"}), 200

    return app