from pytest import raises
from application.models import User, Post, Languages, TravelerTypes, TripTypes
from sqlalchemy.exc import IntegrityError


def test_user_creation(app, user, guard, user_details):
	auth_usr = guard.authenticate(user_details['email'], user_details['password'])
	assert auth_usr is user
	assert auth_usr.is_valid
	assert auth_usr is User.lookup(user.email)
	assert auth_usr is User.identify(user.id)


def test_user_creation_duplicate_email(app, dbx, user, user_details):
	user2 = User(email=user_details['email'], password='PasswordForDuplicateUserTest')
	with raises(IntegrityError):
		dbx.session.add(user2)
		dbx.session.commit()


def test_post_creation(app, dbx, user, post_details):
	post = Post(
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
	dbx.session.add(post)
	dbx.session.commit()

	entry = dbx.session.query(Post).get(1)
	assert entry.title == post_details['title']
	assert entry.url == post_details['url']
	assert entry.language == post_details['language']
	assert entry.date == post_details['date']
	assert entry.traveler == post_details['traveler']
	assert entry.trip == post_details['trip']
	assert entry.latitude == post_details['latitude']
	assert entry.longitude == post_details['longitude']
	assert entry.verified is False
	assert User.identify(entry.user) is user


def test_post_creation_invalid_language(app, dbx, user, post_details):
	post = Post(
		title=post_details['title'],
		url=post_details['url'],
		language="Gibberish",
		date=post_details['date'],
		traveler=post_details['traveler'],
		trip=post_details['trip'],
		latitude=post_details['latitude'],
		longitude=post_details['longitude'],
		user=user.id
	)
	dbx.session.add(post)
	dbx.session.commit()
	with raises(LookupError):
		_ = dbx.session.query(Post).get(1)


def test_post_creation_invalid_latitude(app, dbx, user, post_details):
	with raises(ValueError, match="Invalid latitude value"):
		_ = Post(
			title=post_details['title'],
			url=post_details['url'],
			language=post_details['language'],
			date=post_details['date'],
			traveler=post_details['traveler'],
			trip=post_details['trip'],
			latitude=90.00001,
			longitude=post_details['longitude'],
			user=user.id
		)


def test_post_creation_invalid_longitude(app, dbx, user, post_details):
	with raises(ValueError, match="Invalid longitude value"):
		_ = Post(
			title=post_details['title'],
			url=post_details['url'],
			language=post_details['language'],
			date=post_details['date'],
			traveler=post_details['traveler'],
			trip=post_details['trip'],
			latitude=post_details['latitude'],
			longitude=-180.0,
			user=user.id
		)
