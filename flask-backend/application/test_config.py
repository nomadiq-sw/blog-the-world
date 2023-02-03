from urllib.parse import urljoin

TESTING = True
SECRET_KEY = "insecure-secret-key-for-test"
BASE_URL = "http://localhost:3000"
DOMAIN = "blogtheworld.co"

SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
SQLALCHEMY_TRACK_MODIFICATIONS = False

JWT_ACCESS_LIFESPAN = {"hours": 48}
JWT_REFRESH_LIFESPAN = {"days": 30}

DEFAULT_MAIL_SENDER = "noreply@blogtheworld.co"
PRAETORIAN_CONFIRMATION_SENDER = DEFAULT_MAIL_SENDER
PRAETORIAN_RESET_SENDER = DEFAULT_MAIL_SENDER
PRAETORIAN_CONFIRMATION_URI = urljoin(BASE_URL, "confirm-signup")
PRAETORIAN_RESET_URI = urljoin(BASE_URL, "reset-password")
