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
	user = dbx.session.execute(dbx.select(User).filter_by(email=user_details['email'])).scalar_one()
	return user


@pytest.fixture()
def admin_user(app, dbx, guard, user_details):
	test_user = User(
		email='admin@blog-the-world.net',
		password=guard.hash_password('AdminPassword'),
		roles='admin',
		is_active=True
	)
	dbx.session.add(test_user)
	dbx.session.commit()
	admin_user = dbx.session.execute(dbx.select(User).filter_by(email='admin@blog-the-world.net')).scalar_one()
	return admin_user


@pytest.fixture()
def post_details():
	title = "My First Blog Post"
	language = Languages.EN
	url = "https://blog.com/my-first-blog-post/"
	date = datetime.date.today()
	traveler = TravelerTypes.Family
	trip = {TripTypes.Camping, TripTypes.Mini}
	latitude = 37.26801
	longitude = -90.2022
	verified = True
	return {
		'title': title,
		'language': language,
		'url': url,
		'date': date,
		'traveler': traveler,
		'trip': trip,
		'latitude': latitude,
		'longitude': longitude,
		'verified': verified
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
		verified=post_details['verified'],
		user=user.id
	)
	dbx.session.add(new_post)
	dbx.session.commit()
	post = dbx.session.execute(dbx.select(Post).filter_by(title=post_details['title'])).one()
	return post


@pytest.fixture()
def expired_post(app, dbx, user, post_details):
	exp_title = "An expired blog post"
	exp_post = Post(
		title=exp_title,
		url=post_details['url'],
		language=post_details['language'],
		date=datetime.date.today()-datetime.timedelta(days=730),
		traveler=post_details['traveler'],
		trip=post_details['trip'],
		latitude=post_details['latitude'],
		longitude=post_details['longitude'],
		verified=post_details['verified'],
		user=user.id
	)
	dbx.session.add(exp_post)
	dbx.session.commit()
	post = dbx.session.execute(dbx.select(Post).filter_by(title=exp_title)).one()
	return post


@pytest.fixture()
def unverified_post(app, dbx, user, post_details):
	unv_title = "An unverified blog post"
	unv_post = Post(
		title=unv_title,
		url=post_details['url'],
		language=post_details['language'],
		date=post_details['date'],
		traveler=post_details['traveler'],
		trip=post_details['trip'],
		latitude=post_details['latitude'],
		longitude=post_details['longitude'],
		verified=False,
		user=user.id
	)
	dbx.session.add(unv_post)
	dbx.session.commit()
	post = dbx.session.execute(dbx.select(Post).filter_by(title=unv_title)).one()
	return post
