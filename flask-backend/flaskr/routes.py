from datetime import date
from flask import jsonify, Blueprint
from .models import Languages, TravelerTypes, TripTypes

api = Blueprint('api', __name__)


@api.route("/posts")
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


@api.route("/add-post", methods=['POST'])
def add_post():
	pass
