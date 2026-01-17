"""
Flask application package.
Main app creation logic is in application.py for Elastic Beanstalk.
"""
from app.models.user import User

__all__ = ['User']
