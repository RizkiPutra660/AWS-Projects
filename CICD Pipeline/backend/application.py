import os
import logging
from dotenv import load_dotenv
from flask import Flask, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import text

# Load environment variables
load_dotenv()

# Initialize SQLAlchemy
db = SQLAlchemy()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def create_app():
    """
    Flask application factory for AWS Elastic Beanstalk deployment.
    Supports both local development and production environments.
    """
    app = Flask(__name__, static_folder='static', static_url_path='')
    
    # ===== DATABASE CONFIGURATION =====
    # Elastic Beanstalk provides RDS environment variables
    if 'RDS_HOSTNAME' in os.environ:
        # Production: RDS PostgreSQL (Elastic Beanstalk)
        database_url = (
            f"postgresql://{os.environ['RDS_USERNAME']}:"
            f"{os.environ['RDS_PASSWORD']}@"
            f"{os.environ['RDS_HOSTNAME']}:"
            f"{os.environ['RDS_PORT']}/"
            f"{os.environ['RDS_DB_NAME']}"
        )
    else:
        # Development: Use DATABASE_URL from .env
        database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        raise ValueError("Database URL not configured. Set DATABASE_URL or RDS environment variables.")
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # ===== JWT CONFIGURATION =====
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    app.config['JWT_ALGORITHM'] = os.getenv('JWT_ALGORITHM', 'HS256')
    app.config['ACCESS_TOKEN_EXPIRY'] = int(os.getenv('ACCESS_TOKEN_EXPIRY', 15))  # minutes
    app.config['REFRESH_TOKEN_EXPIRY'] = int(os.getenv('REFRESH_TOKEN_EXPIRY', 7))   # days
    
    # ===== FLASK ENVIRONMENT =====
    flask_env = os.getenv('FLASK_ENV', 'development')
    app.config['DEBUG'] = flask_env != 'production'
    
    # ===== CORS CONFIGURATION =====
    if flask_env == 'production':
        cors_origins = ["https://yourdomain.com"]  # Update with your domain
    else:
        cors_origins = ["http://localhost:3000", "http://localhost:5000", "http://127.0.0.1:3000"]
    
    CORS(app, resources={
        r"/api/*": {
            "origins": cors_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # ===== INITIALIZE DATABASE =====
    db.init_app(app)
    
    # ===== TEST DATABASE CONNECTION =====
    with app.app_context():
        try:
            db.session.execute(text("SELECT 1"))
            logger.info("✓ Database connection successful")
        except Exception as exc:
            logger.error(f"✗ Database connection failed: {exc}", exc_info=True)
            # In development, don't fail on connection error
            if flask_env == 'production':
                raise
    
    # ===== IMPORT MODELS & BLUEPRINTS =====
    from app.models.user import User
    
    # Register blueprints
    try:
        from app.routes import auth
        app.register_blueprint(auth.bp)
        logger.info("✓ Auth blueprint registered")
    except Exception as e:
        logger.warning(f"Could not register auth blueprint: {e}")
    
    # ===== ERROR HANDLERS =====
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"success": False, "error": 404, "message": "Resource not found"}), 404
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"success": False, "error": 400, "message": "Bad request"}), 400
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}", exc_info=True)
        return jsonify({"success": False, "error": 500, "message": "Internal server error"}), 500
    
    @app.errorhandler(422)
    def unprocessable(error):
        return jsonify({"success": False, "error": 422, "message": "Unprocessable request"}), 422
    
    @app.errorhandler(Exception)
    def handle_generic_error(error):
        logger.error(f"Unhandled exception: {error}", exc_info=True)
        return jsonify({"success": False, "error": 500, "message": "Something went wrong"}), 500
    
    # ===== HEALTH CHECK ENDPOINT =====
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "environment": flask_env}), 200
    
    # ===== SERVE REACT FRONTEND =====
    # Catch all non-API routes and serve React index.html
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react_app(path):
        # Don't serve React for API routes
        if path.startswith('api/'):
            return jsonify({"error": "Not found"}), 404
        
        # Serve static files (JS, CSS, images)
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        
        # Serve React index.html for all other routes (SPA routing)
        index_path = os.path.join(app.static_folder, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(app.static_folder, 'index.html')
        else:
            return jsonify({"error": "Frontend not built. Run 'npm run build' in frontend folder."}), 503
    
    # ===== SESSION MANAGEMENT =====
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db.session.remove()
    
    # ===== CREATE DATABASE TABLES =====
    with app.app_context():
        try:
            db.create_all()
            logger.info("✓ Database tables initialized")
        except Exception as e:
            logger.warning(f"Could not create tables: {e}")
    
    return app


# Create app instance for Gunicorn/Elastic Beanstalk
app = create_app()

if __name__ == '__main__':
    # For local development only
    app.run(host='0.0.0.0', port=5000, debug=os.getenv('FLASK_ENV') != 'production')
