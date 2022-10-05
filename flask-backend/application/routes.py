from datetime import date
from flask import jsonify, request, Blueprint
from .models import Languages, TravelerTypes, TripTypes
from flask_cors import CORS
from flask_praetorian import auth_required, roles_required, current_user, Praetorian

api = Blueprint('api', __name__)
guard = Praetorian()
cors = CORS()


@api.route("/login", methods=["POST"])
def login():
	"""
	Logs a user in by parsing a POST request containing user credentials and
	issuing a JWT token.
	.. example::
	   $ curl http://localhost:5000/login -X POST \
		 -d '{"email":"juan.gomez@realtalk.com","password":"verysecure"}'
	"""
	req = request.get_json(force=True)
	email = req.get("email", None)
	password = req.get("password", None)
	user = guard.authenticate(email, password)
	ret = {"access_token": guard.encode_jwt_token(user)}
	return jsonify(ret)


@api.route("/protected")
@auth_required
def protected():
	"""
	A protected endpoint. The auth_required decorator will require a header
	containing a valid JWT
	.. example::
	   $ curl http://localhost:5000/protected -X GET \
		 -H "Authorization: Bearer <your_token>"
	"""
	return jsonify(f"protected endpoint (allowed user {current_user().email})")


@api.route("/protected_admin_required")
@roles_required("admin")
def protected_admin_required():
	"""
	A protected endpoint that requires a role. The roles_required decorator
	will require that the supplied JWT includes the required roles
	.. example::
	   $ curl http://localhost:5000/protected_admin_required -X GET \
		  -H "Authorization: Bearer <your_token>"
	"""
	return jsonify(f"protected_admin_required endpoint (allowed user {current_user().email})")


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