import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.mutable import MutableList

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
	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String, unique=True, nullable=False)
	password = db.Column(db.String, nullable=False)
	display_name = db.Column(db.String, nullable=True)
	active = db.Column(db.Boolean)
	posts = db.relationship('Post', backref='user', lazy=True)


class Post(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String, nullable=False)
	language = db.Column(db.Enum(Languages), nullable=False)
	url = db.Column(db.String, nullable=False)
	date = db.Column(db.Date, nullable=False)
	traveler = db.Column(db.Enum(TravelerTypes), nullable=True)
	trip = db.Column(MutableList.as_mutable(db.Enum(TripTypes)), default=[])
	latitude = db.Column(db.Float, nullable=False)
	longitude = db.Column(db.Float, nullable=False)
	user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
