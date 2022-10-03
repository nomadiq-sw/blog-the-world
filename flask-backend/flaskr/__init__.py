import os
from flask import Flask, jsonify
from flask_migrate import Migrate
from passlib.context import CryptContext
from .models import Languages, TravelerTypes, TripTypes, db
from datetime import date
from flask_jwt_extended import JWTManager


def create_app(test_config=None):
	app = Flask(__name__, instance_relative_config=True)
	app.config.from_mapping(
		DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
	)

	if test_config is None:
		app.config.from_pyfile('config.py', silent=True)
	else:
		app.config.from_mapping(test_config)

	try:
		os.makedirs(app.instance_path)
	except OSError:
		pass

	db.init_app(app)
	Migrate(app, db)

	pwd_context = CryptContext(
		schemes=['argon2'],
		deprecated='auto'
	)

	jwt = JWTManager(app)

	@app.route("/posts")
	def posts():
		test_response = (
			{
				'id': 1,
				'title': "My awesome blog post",
				'language': Languages.EN,
				'url': "https://www.blog.com/posts/my-awesome-blog-post/",
				'date': date.today(),
				'traveler': TravelerTypes.Solo,
				'trip': [TripTypes.Backpack],
				'latitude': 37.26801,
				'longitude': -90.2022
			},
			{
				'id': 2,
				'title': "My other blog post",
				'language': Languages.EN,
				'url': "https://www.blog.com/posts/my-other-blog-post/",
				'date': date(2021, 11, 1),
				'traveler': TravelerTypes.Family,
				'trip': [TripTypes.Caravan, TripTypes.Roadtrip],
				'latitude': -27.26801,
				'longitude': 120.2022
			}
		)
		response = jsonify(test_response)
		response.headers.add("Access-Control-Allow-Origin", '*')
		return response

	@app.route("/add-post", methods=['POST'])
	def add_post():
		pass

	return app
