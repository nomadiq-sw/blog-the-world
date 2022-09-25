from flask import Flask, jsonify
from datetime import date

app = Flask(__name__)


@app.route("/posts")
def posts():
	test_response = (
		{
			'id': 1,
			'title': "My awesome blog post",
			'url': "https://www.blog.com/posts/my-awesome-blog-post/",
			'date': date.today(),
			'traveler': "Solo",
			'voyage': "Backpack",
			'latitude': 37.26801,
			'longitude': -90.2022
		},
		{
			'id': 2,
			'title': "My other blog post",
			'url': "https://www.blog.com/posts/my-other-blog-post/",
			'date': date(2021, 11, 1),
			'traveler': "Family",
			'voyage': "Campervan",
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
