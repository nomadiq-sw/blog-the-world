import enum
import jwt
from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.mutable import MutableList
from datetime import datetime, timedelta
from flask_bcrypt import generate_password_hash

db = SQLAlchemy()


class Languages(str, enum.Enum):
	# Languages with at least 1% share of top 10M websites according to Wikipedia (source W3Tech):
	AR = 'Arabic'
	DE = 'German'
	EN = 'English'
	ES = 'Spanish'
	FA = 'Persian'
	FR = 'French'
	IT = 'Italian'
	JP = 'Japanese'
	NL = 'Dutch'
	PL = 'Polish'
	PT = 'Portuguese'
	RU = 'Russian'
	TR = 'Turkish'
	VI = 'Vietnamese'
	ZH = 'Chinese'


class TravelerTypes(str, enum.Enum):
	Solo = 'Solo'
	Couple = 'Couple'
	Family = 'Family'
	Group = 'Group'


class TripTypes(str, enum.Enum):
	Backpack = 'Backpacking'
	Business = 'Business trip'
	Camping = 'Camping'
	Caravan = 'Camper/caravan'
	Hiking = 'Hiking/cycling'
	Mini = 'Mini-break'
	Package = 'Package holiday'
	Roadtrip = 'Roadtrip'


class User(db.Model):
	__tablename__ = "users"

	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(254), unique=True, nullable=False)
	password = db.Column(db.String(30), nullable=False)
	display_name = db.Column(db.String(30), nullable=True)
	active = db.Column(db.Boolean, nullable=False, default=True)
	admin = db.Column(db.Boolean, nullable=False, default=False)
	posts = db.relationship('Post', backref='users', lazy=True)

	def __init__(self, email, password, display=None, active=True, admin=False):
		self.email = email
		self.password = generate_password_hash(password, 10).decode('utf-8')
		self.display_name = display
		self.active = active
		self.admin = admin

	def encode_auth_token(self):
		try:
			payload = {
				'exp': datetime.utcnow() + timedelta(days=0, seconds=5),
				'iat': datetime.utcnow(),
				'sub': self.id
			}
			return jwt.encode(payload, current_app.config.get('JWT_SECRET_KEY'), algorithm='HS256')
		except Exception as e:
			return e

	@staticmethod
	def decode_auth_token(auth_token):
		try:
			payload = jwt.decode(auth_token, current_app.config.get('JWT_SECRET_KEY'), algorithms='HS256')
			return payload['sub']
		except jwt.ExpiredSignatureError:
			return 'Signature expired. Please log in again.'
		except jwt.InvalidTokenError:
			return 'Invalid token. Please log in again.'


class Post(db.Model):
	__tablename__ = "posts"

	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(180), nullable=False)
	language = db.Column(db.Enum(Languages), nullable=False)
	url = db.Column(db.String(2048), nullable=False)
	date = db.Column(db.Date, nullable=False)
	traveler = db.Column(db.Enum(TravelerTypes), nullable=True)
	trip = db.Column(MutableList.as_mutable(db.Enum(TripTypes)), default=[])
	latitude = db.Column(db.Float, nullable=False)
	longitude = db.Column(db.Float, nullable=False)
	user = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
