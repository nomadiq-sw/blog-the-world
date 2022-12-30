import sys
import requests
import logging
import datetime
from flask import jsonify, make_response, request, render_template, current_app, Blueprint
from sqlalchemy.exc import NoResultFound, SQLAlchemyError
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
from .models import Languages, TravelerTypes, TripTypes, User, Post, db

api = Blueprint('api', __name__)
guard = Praetorian()
cors = CORS()

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)


def jsonify_message(message):
	return jsonify({'message': message})


@api.route("/validate-recaptcha/<token>")
def validate_recaptcha(token):
	if current_app.config.get('TESTING'):
		return '', 204
	else:
		response = requests.post(
			"https://www.google.com/recaptcha/api/siteverify",
			data={
				'secret': current_app.config.get('RECAPTCHA_SECRET_KEY'),
				'response': token
			}
		)
		data = response.json()
		if 'success' in data and data['success']:
			return '', 204
		else:
			return jsonify_message("reCAPTCHA validation failed"), 403


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
		return jsonify_message("Signup successful. Please check your e-mail inbox."), 201

	return jsonify_message("This e-mail is already in use. Please log in to continue."), 409


@api.route('/confirm-signup/<token>')
def confirm_signup(token):
	try:
		token_user = guard.get_user_from_registration_token(token)
		if token_user and not token_user.is_valid():
			token_user.is_active = True
			db.session.commit()
			return jsonify_message("Thank you for confirming your signup. You may now log in."), 200
		else:
			return jsonify_message("Invalid request. If you are already registered, please log in to continue."), 400
	except (InvalidTokenHeader, InvalidRegistrationToken, MissingToken, MisusedResetToken):
		return jsonify_message("Invalid token in confirmation URL. Please renew your signup request."), 400


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
		return jsonify_message("We've sent you a link to reset your password. Please check your e-mail inbox."), 200

	return jsonify_message("This e-mail is not associated with any user. Please sign up to continue."), 400


@api.route('/reset-password/<token>', methods=["POST"])
def reset_password(token):
	try:
		token_user = guard.validate_reset_token(token)
		if token_user is not None:
			req = request.get_json(force=True)
			new_pwd = req.get("new_password", None)
			token_user.password = guard.hash_password(new_pwd)
			db.session.commit()
			return jsonify_message("Password reset successful. You may now log in."), 201
		return jsonify_message("Invalid request. No user found matching supplied token."), 400
	except (InvalidTokenHeader, InvalidResetToken, MissingToken, MisusedRegistrationToken):
		return jsonify_message("Invalid token in reset URL. Please renew your password reset request."), 400


@api.route("/posts")
@api.route("/posts/<slug>")
def posts(
	slug=None,
	include_unverified=True,
	cutoff_date=datetime.date.today()-datetime.timedelta(days=730)
):
	if slug is None:
		if include_unverified:
			all_posts = db.session.execute(db.select(Post).filter(
				Post.date > cutoff_date)
			).all()
		else:
			all_posts = db.session.execute(db.select(Post).filter(
				Post.date > cutoff_date,
				Post.verified is True
			)).all()
		post_list = []
		for post in all_posts:
			post_list.append(post[0].to_dict())
		response = make_response(post_list), 200  # N.B. DO NOT JSONIFY: Flask does it automatically
	else:
		try:
			post = db.session.execute(db.select(Post).filter(
				Post.id == slug,
				Post.date > cutoff_date)
			).one()
			# Ignore warning about access to protected member, this is from the NamedTuple API:
			post_dict = post._asdict()['Post'].to_dict()
			if not include_unverified and not post_dict['verified']:
				raise NoResultFound
			response = make_response(post_dict), 200
		except NoResultFound:
			logging.warning(f"Attempted to read post record with id {slug}")
			response = '', 404
	return response


@api.route("/add-post", methods=['POST'])
@auth_required
def add_post():
	data = request.get_json(force=True)
	auth_header = request.headers.get('Authorization')
	token = auth_header.split()[1]
	user_id = guard.extract_jwt_token(token).get('id')
	user = User.identify(user_id)
	if user and data:
		try:
			is_update = False
			if data.get('update_id'):
				is_update = True
				pid = data.get('update_id')
				post = db.session.execute(db.select(Post).filter_by(id=pid)).scalar_one()
			else:
				post = Post()
			post.title = data.get('title')
			post.url = data.get('url')
			post.language = Languages(data.get('language')).name
			post.date = datetime.date.today()
			if data.get('traveler'):
				post.traveler = TravelerTypes(data.get('traveler')).name
			else:
				post.traveler = None
			post.trip = {tt for tt in data.get('trip')}
			post.latitude = data.get('latitude')
			post.longitude = data.get('longitude')
			post.user = user_id
			post.verified = False
			if is_update:
				db.session.merge(post)
				message = "Post details updated successfully!"
			else:
				db.session.add(post)
				message = "New post added successfully!"
			db.session.commit()
			return jsonify_message(message), 201
		except (ValueError, SQLAlchemyError) as e:
			logging.error(f"Exception {e}")
			db.session.rollback()
			return jsonify_message("Error adding or updating post, please try again later"), 400
	return jsonify_message("An unexpected error occurred, please try again later"), 400


@api.route("/delete-post/<slug>", methods=["POST"])
@roles_required("admin")
def delete_post():
	pass
