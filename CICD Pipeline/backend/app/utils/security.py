import os
import bcrypt

# Cost factor controls how expensive hashing is; higher is slower but more secure.
COST_FACTOR = int(os.getenv("BCRYPT_ROUNDS", 12))


def hash_password(plaintext_password: str) -> str:
    """Hash a plaintext password using bcrypt with a per-password salt."""
    if not plaintext_password:
        raise ValueError("Password cannot be empty")
    salt = bcrypt.gensalt(rounds=COST_FACTOR)
    hashed = bcrypt.hashpw(plaintext_password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plaintext_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a stored bcrypt hash."""
    if not plaintext_password or not hashed_password:
        return False
    try:
        return bcrypt.checkpw(plaintext_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except (ValueError, TypeError):
        return False
