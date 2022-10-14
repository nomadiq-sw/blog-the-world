import datetime

import pytest
from application import create_app
from application.models import db, User, Post, Languages, TravelerTypes, TripTypes
from flask_praetorian import Praetorian
from flask_mail import Mail


@pytest.fixture()
def app():
	app = create_app(test_config='test_config.py')
	yield app


@pytest.fixture()
def dbx(app):
	with app.app_context():
		db.create_all()
		yield db


@pytest.fixture()
def outbox(app):
	with app.app_context():
		mail = Mail(app)
		with mail.record_messages() as box:
			yield box


@pytest.fixture()
def client(app):
	return app.test_client()


@pytest.fixture()
def runner(app):
	return app.test_cli_runner()


@pytest.fixture()
def guard(app):
	guard = Praetorian(app, User)
	return guard


@pytest.fixture()
def user_details():
	email = "juan.gomez@realtalk.com"
	password = "HappyGoLucky"
	return {'email': email, 'password': password}


@pytest.fixture()
def user(app, dbx, guard, user_details):
	test_user = User(
		email=user_details['email'],
		password=guard.hash_password(user_details['password']),
		is_active=True
	)
	dbx.session.add(test_user)
	dbx.session.commit()
	user = dbx.session.query(User).get(1)
	return user


@pytest.fixture()
def post_details():
	title = "My First Blog Post"
	language = Languages.EN
	url = "https://blog.com/my-first-blog-post/"
	date = datetime.date.today()
	traveler = TravelerTypes.Family
	trip = [TripTypes.Camping, TripTypes.Roadtrip]
	latitude = 37.26801
	longitude = -90.20220
	return {
		'title': title,
		'language': language,
		'url': url,
		'date': date,
		'traveler': traveler,
		'trip': trip,
		'latitude': latitude,
		'longitude': longitude
	}


@pytest.fixture()
def post(app, dbx, user, post_details):
	new_post = Post(
		title=post_details['title'],
		url=post_details['url'],
		language=post_details['language'],
		date=post_details['date'],
		traveler=post_details['traveler'],
		trip=post_details['trip'],
		latitude=post_details['latitude'],
		longitude=post_details['longitude'],
		user=user.id
	)
	dbx.session.add(new_post)
	dbx.session.commit()
	post = dbx.session.query(Post).get(1)
	return post
