import json
from flask import jsonify, request, render_template, current_app, Blueprint
from .models import Languages, TravelerTypes, TripTypes, User, Post, db
from flask_cors import CORS
from flask_praetorian import auth_required, roles_required, Praetorian
from flask_praetorian.exceptions import (
	InvalidTokenHeader,
	InvalidRegistrationToken,
	InvalidResetToken,
	MissingToken,
	MisusedResetToken,
	MisusedRegistrationToken
)

api = Blueprint('api', __name__)
guard = Praetorian()
cors = CORS()


@api.route("/signup", methods=["POST"])
def signup():
	req = request.get_json(force=True)
	email = req.get("email", None)
	password = req.get("password", None)
	if User.lookup(email) is None:
		new_user = User(email=email, password=guard.hash_password(password))
		db.session.add(new_user)
		db.session.commit()
		html = render_template(
			"signup_confirmation_email.html",
			domain=current_app.config.get('DOMAIN'),
			confirmation_uri=current_app.config.get('PRAETORIAN_CONFIRMATION_URI'),
			token=guard.encode_jwt_token(new_user, bypass_user_check=True, is_registration_token=True)
		)
		guard.send_registration_email(
			email,
			template=html,
			user=new_user,
			subject="Confirm your signup"
		)
		return jsonify("Signup successful. Please check your e-mail inbox."), 201

	return jsonify("This e-mail is already in use. Please log in to continue."), 409


@api.route('/confirm-signup/<token>')
def confirm_signup(token):
	try:
		token_user = guard.get_user_from_registration_token(token)
		if token_user and not token_user.is_valid():
			token_user.is_active = True
			db.session.commit()
			return jsonify("Thank you for confirming your signup. You may now log in."), 200
		else:
			return jsonify("Invalid request. If you are already registered, please log in to continue."), 400
	except (InvalidTokenHeader, InvalidRegistrationToken, MissingToken, MisusedResetToken):
		return jsonify("Invalid token in confirmation URL. Please renew your signup request."), 400


@api.route("/login", methods=["POST"])
def login():
	"""
	Logs a user in by parsing a POST request containing user credentials and
	issuing a JWT token.
	.. example::
	   $ curl http://localhost:5000/login -X POST \
		 -d '{"email":"juan.gomez@realtalk.com","password":"HappyGoLucky"}'
	"""
	req = request.get_json(force=True)
	email = req.get("email", None)
	password = req.get("password", None)
	user = guard.authenticate(email, password)
	ret = {"access_token": guard.encode_jwt_token(user)}
	return jsonify(ret), 200


@api.route('/forgotten-password', methods=["POST"])
def forgotten_password():
	req = request.get_json(force=True)
	email = req.get("email", None)
	user = User.lookup(email)
	if user is not None:
		html = render_template(
			"password_reset_email.html",
			domain=current_app.config.get('DOMAIN'),
			reset_uri=current_app.config.get('PRAETORIAN_RESET_URI'),
			token=guard.encode_jwt_token(user, bypass_user_check=True, is_reset_token=True)
		)
		guard.send_reset_email(
			email,
			template=html,
			subject="Reset your password"
		)
		return jsonify("Password reset request successful. Please check your e-mail inbox."), 200

	return jsonify("This e-mail is not associated with any user. Please sign up to continue."), 400


@api.route('/reset-password/<token>', methods=["GET", "POST"])
def reset_password(token):
	try:
		token_user = guard.validate_reset_token(token)
		if token_user is not None:
			if request.method == "POST":
				req = request.get_json(force=True)
				new_pwd = req.get("new_password", None)
				token_user.password = guard.hash_password(new_pwd)
				db.session.commit()
				return jsonify("Password reset successful. You may now log in."), 200
			else:
				return jsonify("Please enter a new password."), 200
		return jsonify("Invalid request. No user found matching supplied token."), 400
	except (InvalidTokenHeader, InvalidResetToken, MissingToken, MisusedRegistrationToken):
		return jsonify("Invalid token in reset URL. Please renew your password reset request."), 400


@api.route("/posts")
def posts():
	all_posts = Post.query.all()
	post_list = []
	for post in all_posts:
		post_list.append(json.dumps(post.to_dict()))
	response = jsonify(post_list)
	response.headers.add("Access-Control-Allow-Origin", '*')
	return response, 200


@api.route("/add-post", methods=['POST'])
@auth_required
def add_post():
	pass


@api.route("/delete-post/<slug>", methods=["POST"])
@roles_required("admin")
def delete_post():
	pass
