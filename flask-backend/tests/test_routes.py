from application.models import db


def test_get_posts(client):
	response = client.get('/posts')
	assert response.status_code == 200
	assert b"My awesome blog post" in response.data
	assert b"My other blog post" in response.data


def test_signup_success(app, client, user_details):
	with app.app_context():
		db.create_all()
		response = client.post(
			'/signup',
			json={"email": user_details['email'], "password": user_details['password']}
		)
		assert response.status_code == 201
		assert b"Signup successful" in response.data


def test_login_success(client, user, user_details):
	response = client.post(
		'/login',
		json={"email": user_details['email'], "password": user_details['password']}
	)
	assert response.status_code == 200
	assert b'{"access_token":' in response.data
