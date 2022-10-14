from application.models import User


def test_get_posts(client):
	response = client.get('/posts')
	assert response.status_code == 200
	assert b"My awesome blog post" in response.data
	assert b"My other blog post" in response.data


def test_signup_success(app, dbx, client, user_details, outbox):
	response = client.post(
		'/signup',
		json={"email": user_details['email'], "password": user_details['password']}
	)
	assert response.status_code == 201
	assert b"Signup successful" in response.data
	assert len(outbox) == 1
	assert outbox[0].subject == "Confirm your signup"
	assert "You have successfully signed up to Blog The World" in outbox[0].html


def test_signup_existing_user(client, user, user_details, outbox):
	response = client.post(
		'/signup',
		json={"email": user_details['email'], "password": user_details['password']}
	)
	assert response.status_code == 409
	assert b"This e-mail is already in use." in response.data
	assert len(outbox) == 0


def test_signup_confirmation_valid(app, dbx, client, guard, user_details):
	response = client.post(
		'/signup',
		json={"email": user_details['email'], "password": user_details['password']}
	)
	assert response.status_code == 201
	new_user = User.lookup(user_details['email'])
	assert new_user is not None
	token = guard.encode_jwt_token(new_user, bypass_user_check=True, is_registration_token=True)
	response = client.get(
		f'/confirm-signup/{token}'
	)
	assert response.status_code == 200
	assert new_user.is_valid()


def test_signup_confirmation_invalid_token(app, dbx, client, guard, user_details):
	response = client.post(
		'/signup',
		json={"email": user_details['email'], "password": user_details['password']}
	)
	new_user = User.lookup(user_details['email'])
	token = guard.encode_jwt_token(new_user, bypass_user_check=True, is_reset_token=True)
	response = client.get(
		f'/confirm-signup/{token}'
	)
	assert response.status_code == 400
	assert b"Invalid token in confirmation URL." in response.data


def test_login_success(client, user, user_details):
	response = client.post(
		'/login',
		json={"email": user_details['email'], "password": user_details['password']}
	)
	assert response.status_code == 200
	assert b'{"access_token":' in response.data


def test_login_invalid_mail(client, user, user_details):
	response = client.post(
		'/login',
		json={"email": "not.a.user@realtalk.com", "password": user_details['password']}
	)
	assert response.status_code == 401


def test_login_invalid_password(client, user, user_details):
	response = client.post(
		'/login',
		json={"email": user_details['email'], "password": "wrong-password"}
	)
	assert response.status_code == 401


def test_forgotten_password_valid(client, user, user_details, outbox):
	response = client.post(
		'/forgotten-password',
		json={"email": user_details['email']}
	)
	assert response.status_code == 200
	assert b"Password reset request successful." in response.data
	assert len(outbox) == 1
	assert outbox[0].subject == "Reset your password"
	assert "You have requested to reset your password" in outbox[0].html


def test_forgotten_password_invalid_mail(client, user, outbox):
	response = client.post(
		'/forgotten-password',
		json={"email": "not.a.user@realtalk.com"}
	)
	assert response.status_code == 400
	assert b"This e-mail is not associated with any user." in response.data
	assert len(outbox) == 0


def test_password_reset_valid_get(client, user, guard):
	token = guard.encode_jwt_token(user, bypass_user_check=True, is_reset_token=True)
	response = client.get(
		f'/reset-password/{token}'
	)
	assert response.status_code == 200
	assert b"Please enter a new password." in response.data


def test_password_reset_invalid_token_get(client, user, guard):
	token = guard.encode_jwt_token(user, bypass_user_check=True, is_reset_token=True)
	response = client.get(
		f'/reset-password/{token}abc'
	)
	assert response.status_code == 400
	assert b"Invalid token in reset URL." in response.data


def test_password_reset_valid_post(client, user, guard):
	token = guard.encode_jwt_token(user, bypass_user_check=True, is_reset_token=True)
	response = client.post(
		f'/reset-password/{token}',
		json={"new_password": "aNewSecurePassword"}
	)
	assert response.status_code == 200
	assert b"Password reset successful." in response.data
	assert guard.authenticate(user.email, "aNewSecurePassword") is user


def test_password_reset_invalid_token_post(client, user, guard):
	token = guard.encode_jwt_token(user, bypass_user_check=True, is_registration_token=True)
	response = client.post(
		f'/reset-password/{token}',
		json={"new_password": "aNewSecurePassword"}
	)
	assert response.status_code == 400
	assert b"Invalid token in reset URL." in response.data
