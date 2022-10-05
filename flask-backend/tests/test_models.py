from pytest import approx
from application.models import db, User, Post, Languages, TravelerTypes, TripTypes
from datetime import date


def test_user_creation(app, user, guard, user_details):
	with app.app_context():
		auth_usr = guard.authenticate(user_details['email'], user_details['password'])
		assert auth_usr is user
		assert auth_usr.is_valid
		assert auth_usr is User.lookup(user.email)
		assert auth_usr is User.identify(user.id)


def test_post_creation(app, user):
	with app.app_context():
		test_title = "My cool blog post"
		test_url = "https://www.my-blog.com/my-cool-blog-post/"
		test_lang = Languages.EN
		test_date = date.today()
		test_traveler = TravelerTypes.Family
		test_trip = [TripTypes.Camping, TripTypes.Roadtrip]
		test_latitude = 37.26801
		test_longitude = -90.2022
		post = Post(
			title=test_title,
			url=test_url,
			language=test_lang,
			date=test_date,
			traveler=test_traveler,
			trip=test_trip,
			latitude=test_latitude,
			longitude=test_longitude,
			user=user.id
		)
		db.session.add(post)
		db.session.commit()

		entry = db.session.query(Post).get(1)
		assert entry.title == test_title
		assert entry.url == test_url
		assert entry.language == Languages.EN
		assert entry.date == date.today()
		assert entry.traveler == TravelerTypes.Family
		assert len(entry.trip) == 2
		assert entry.latitude == approx(test_latitude, 0.0001)
		assert entry.longitude == approx(test_longitude, 0.0001)
		assert User.identify(entry.user) is user
