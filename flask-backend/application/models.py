# Copyright 2023 Owen M. Jones. All rights reserved.
#
# This file is part of BlogTheWorld.
#
# BlogTheWorld is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License
# as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
#
# BlogTheWorld is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
# of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License along with BlogTheWorld. If not, see <https://www.gnu.org/licenses/>.

import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.mutable import MutableSet
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

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
	Couple = 'Couple'
	Family = 'Family'
	Friends = 'Friends'
	Group = 'Group'
	Solo = 'Solo'


class TripTypes(str, enum.Enum):
	Backpack = 'Backpacking'
	Business = 'Business trip'
	Camping = 'Camping'
	Caravan = 'Camper/caravan'
	Cruise = 'Cruise'
	Cycling = 'Cycling'
	Hiking = 'Hiking'
	Long = 'Long stay'
	Mini = 'Mini-break'
	Package = 'Package holiday'
	Roadtrip = 'Roadtrip'
	Volunteer = 'Volunteering'


class User(db.Model):
	__tablename__ = "users"

	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(255), unique=True, nullable=False)
	password = db.Column(db.String(255), nullable=False)
	display_name = db.Column(db.String(30), nullable=True)
	is_active = db.Column(db.Boolean, nullable=False, default=False, server_default="false")
	roles = db.Column(db.String(255), nullable=True)
	posts = db.relationship('Post', backref='users', lazy=True)

	@property
	def identity(self):
		"""
		*Required Attribute or Property*

		flask-praetorian requires that the user class has an ``identity`` instance
		attribute or property that provides the unique id of the user instance
		"""
		return self.id

	@property
	def rolenames(self):
		"""
		*Required Attribute or Property*

		flask-praetorian requires that the user class has a ``rolenames`` instance
		attribute or property that provides a list of strings that describe the roles
		attached to the user instance
		"""
		try:
			if self.roles is not None:
				return self.roles.split(",")
			else:
				return []
		except Exception as e:
			return [e]

	@classmethod
	def lookup(cls, email):
		"""
		*Required Method*

		flask-praetorian requires that the user class implements a ``lookup()``
		class method that takes a single ``username`` argument and returns a user
		instance if there is one that matches or ``None`` if there is not.
		"""
		return cls.query.filter_by(email=email).one_or_none()

	@classmethod
	def identify(cls, uid):
		"""
		*Required Method*

		flask-praetorian requires that the user class implements an ``identify()``
		class method that takes a single ``id`` argument and returns user instance if
		there is one that matches or ``None`` if there is not.
		"""
		return cls.query.get(uid)

	def is_valid(self):
		return self.is_active


class Post(db.Model, SerializerMixin):
	__tablename__ = "posts"
	serialize_only = ('id', 'title', 'url', 'language', 'date', 'traveler', 'trip', 'latitude', 'longitude', 'verified')

	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(180), nullable=False)
	language = db.Column(db.Enum(Languages), nullable=False)
	url = db.Column(db.String(2048), nullable=False)
	date = db.Column(db.Date, nullable=False)
	traveler = db.Column(db.Enum(TravelerTypes), nullable=True)
	trip = db.Column(MutableSet.as_mutable(db.PickleType), default={})
	latitude = db.Column(db.Float, nullable=False)
	longitude = db.Column(db.Float, nullable=False)
	verified = db.Column(db.Boolean, nullable=False, default=False, server_default="false")
	user = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

	@validates('latitude')
	def validate_latitude(self, key, latitude):
		if latitude:
			if latitude < -90.0 or latitude > 90.0:
				raise ValueError("Invalid latitude value")
			return latitude
		raise ValueError("No latitude value provided")

	@validates('longitude')
	def validate_longitude(self, key, longitude):
		if longitude:
			if longitude <= -180.0 or longitude > 180.0:
				raise ValueError("Invalid longitude value")
			return longitude
		raise ValueError("No longitude value provided")
