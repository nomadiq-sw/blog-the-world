from flask import Flask, jsonify
from flask_migrate import Migrate
from passlib.context import CryptContext
from models import Languages, TravelerTypes, TripTypes, db
from datetime import date
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
db.init_app(app)
Migrate(app, db)

pwd_context = CryptContext(
	schemes=['argon2'],
	deprecated='auto'
)

app.config["JWT_SECRET_KEY"] = "insecure-secret-key-for-dev"
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
