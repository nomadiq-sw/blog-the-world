import pytest
from application import create_app
from application.models import db, User
from flask_praetorian import Praetorian


@pytest.fixture()
def app():
	app = create_app(test_config='test_config.py')
	yield app


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
def user(app, guard, user_details):
	with app.app_context():
		db.create_all()
		test_user = User(
			email=user_details['email'],
			password=guard.hash_password(user_details['password'])
		)
		db.session.add(test_user)
		db.session.commit()
		user = db.session.query(User).get(1)
		yield user
