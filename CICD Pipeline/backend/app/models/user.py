from app import db
from werkzeug.security import check_password_hash, generate_password_hash
from email_validator import validate_email, EmailNotValidError
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), 
    nullable=False)

    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    last_login = db.Column(db.DateTime)

    preferences = db.relationship('UserPreferences', backref='user', uselist=False, cascade="all, delete-orphan")
    def set_password(self, password):
        """Hash and set the user's password"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify the provided password against the stored hash"""
        return check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        """Update the last login timestamp"""
        self.last_login = datetime.now()
        db.session.commit()
    
    def to_dict(self, include_email=True):
        """Convert user to dictionary for JSON serialization"""
        data = {
            'user_id': self.user_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }
        if include_email:
            data['email'] = self.email
        return data
    
    @staticmethod
    def is_valid_email(email):
        """Validate email format"""
        try:
            valid = validate_email(email)
            return True, valid.email
        except EmailNotValidError as e:
            return False, str(e)

    @staticmethod
    def is_valid_password(password):
        if len(password) < 8:
            return False, "Password must be at least 8 characters long."
        if not any(char.isupper() for char in password):
            return False, "Password must contain at least one uppercase letter."
        if not any(char.islower() for char in password):
            return False, "Password must contain at least one lowercase letter."
        if not any(char.isdigit() for char in password):
            return False, "Password must contain at least one digit."
        if not any(char in '!@#$%^&*()_+-=[]{}|;:,.<>?/' for char in password):
            return False, "Password must contain at least one special character."
        return True, "Password meets strength requirements."

    def __repr__(self):
        return f'<User {self.email}>'