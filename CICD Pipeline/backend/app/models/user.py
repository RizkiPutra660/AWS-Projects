from app import db
from email_validator import validate_email, EmailNotValidError
from datetime import datetime
from app.utils.security import hash_password, verify_password

class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    last_login = db.Column(db.DateTime)

    preferences = db.relationship('UserPreferences', backref='user', uselist=False, cascade="all, delete-orphan")

    def set_password(self, password):
        """Hash and set the user's password using bcrypt"""
        self.password_hash = hash_password(password)

    def check_password(self, password):
        """Verify the provided password against the stored hash"""
        return verify_password(password, self.password_hash)
    
    def update_last_login(self):
        """Update the last login timestamp"""
        self.last_login = datetime.now(datetime.timezone.utc)
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
        """Validate password strength requirements"""
        if not password:
            return False, "Password cannot be empty."
        
        if len(password) < 8:
            return False, "Password must be at least 8 characters long."
        
        if len(password) > 128:
            return False, "Password must not exceed 128 characters."
        
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
