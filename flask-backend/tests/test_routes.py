import datetime
import json
from application.models import User, Post


def test_get_posts(app, dbx, client, post_details, post):
	response = client.get('/posts')
	assert response.status_code == 200
	resp_list = json.loads(response.data.decode('utf-8'))
	resp_dict = resp_list[0]
	assert resp_dict['title'] == post_details['title']


def test_get_posts_including_unverified(app, dbx, client, post_details, post, unverified_post):
	response = client.get('/posts')
	assert response.status_code == 200
	resp_list = json.loads(response.data.decode('utf-8'))
	assert len(resp_list) == 2
	assert {resp_list[0]['title'], resp_list[1]['title']} == {post_details['title'], "An unverified blog post"}
	resp_verified = [resp for resp in resp_list if resp['verified'] is True]
	resp_unverified = [resp for resp in resp_list if resp['verified'] is False]
	assert len(resp_verified) == 1
	assert len(resp_unverified) == 1
	assert resp_verified[0]['title'] == post_details['title']
	assert resp_unverified[0]['title'] == "An unverified blog post"


def test_get_posts_excluding_expired(app, dbx, client, post_details, post, expired_post):
	response = client.get('/posts')
	assert response.status_code == 200
	resp_list = json.loads(response.data.decode('utf-8'))
	assert len(resp_list) == 1
	assert resp_list[0]['title'] == post_details['title']


def test_get_single_post(app, dbx, client, post_details, post):
	response = client.get('/posts/1')
	assert response.status_code == 200
	resp_dict = json.loads(response.data.decode('utf-8'))
	assert resp_dict['title'] == post_details['title']


def test_get_single_post_invalid_id(app, dbx, client, post):
	response = client.get('/posts/0')
	assert response.status_code == 404
	assert response.data.decode('utf-8') == ''
	response = client.get('/posts/2')
	assert response.status_code == 404
	assert response.data.decode('utf-8') == ''


def test_get_single_post_expired(app, dbx, client, expired_post):
	response = client.get('/posts/1')
	assert response.status_code == 404
	assert response.data.decode('utf-8') == ''


def test_get_single_post_unverified(app, dbx, client, unverified_post):
	response = client.get('/posts/1')
	assert response.status_code == 200
	resp_dict = json.loads(response.data.decode('utf-8'))
	assert resp_dict['title'] == "An unverified blog post"


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
	signup_response = client.post(
		'/signup',
		json={"email": user_details['email'], "password": user_details['password']}
	)
	assert signup_response.status_code == 201
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
	assert b"We've sent you a link to reset your password." in response.data
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


def test_password_reset_valid_token(client, user, guard):
	token = guard.encode_jwt_token(user, bypass_user_check=True, is_reset_token=True)
	response = client.post(
		f'/reset-password/{token}',
		json={"new_password": "aNewSecurePassword"}
	)
	assert response.status_code == 201
	assert b"Password reset successful." in response.data
	assert guard.authenticate(user.email, "aNewSecurePassword") is user


def test_password_reset_invalid_token(client, user, guard):
	token = guard.encode_jwt_token(user, bypass_user_check=True, is_registration_token=True)
	response = client.post(
		f'/reset-password/{token}',
		json={"new_password": "aNewSecurePassword"}
	)
	assert response.status_code == 400
	assert b"Invalid token in reset URL." in response.data


def test_dummy_recaptcha_validation(client):
	response = client.get('/validate-recaptcha/1234')
	assert response.status_code == 204


def test_add_post_unauthenticated_user(client, user):
	response = client.post('/add-post', data={})
	assert response.status_code == 401


def test_add_post_authenticated_user(app, dbx, client, guard, user, post_details):
	token = guard.encode_jwt_token(user)
	response = client.post(
		'/add-post',
		headers={"Authorization": f"Bearer {token}"},
		json={
			"title": post_details['title'],
			"url": post_details['url'],
			"language": post_details['language'].value,
			"traveler": post_details['traveler'].value,
			"trip": [tt.name for tt in post_details['trip']],
			"latitude": post_details['latitude'],
			"longitude": post_details['longitude']
		}
	)
	assert response.status_code == 201
	assert b"New post added successfully" in response.data
	post = dbx.session.query(Post).get(1)
	assert post is not None
	assert post.title == post_details['title']
	assert post.url == post_details['url']
	assert post.language == post_details['language']
	assert post.traveler == post_details['traveler']
	assert post.trip == post_details['trip']
	assert post.date == datetime.date.today()
	assert post.latitude == post_details['latitude']
	assert post.longitude == post_details['longitude']
	assert post.verified is False


def test_add_post_invalid_token(app, dbx, client, guard, user, post_details):
	token = guard.encode_jwt_token(user) + '123'
	response = client.post(
		'/add-post',
		headers={"Authorization": f"Bearer {token}"},
		json={
			"title": post_details['title'],
			"url": post_details['url'],
			"language": post_details['language'].value,
			"traveler": post_details['traveler'].value,
			"trip": [tt.name for tt in post_details['trip']],
			"latitude": post_details['latitude'],
			"longitude": post_details['longitude']
		}
	)
	assert response.status_code == 401


def test_add_post_missing_data(app, dbx, client, guard, user, post_details):
	token = guard.encode_jwt_token(user)
	response = client.post(
		'/add-post',
		headers={"Authorization": f"Bearer {token}"},
		json={
			"title": post_details['title'],
			"url": post_details['url'],
			"language": post_details['language'].value,
			"traveler": post_details['traveler'].value,
			"trip": [tt.name for tt in post_details['trip']],
			"latitude": post_details['latitude']
		}
	)
	assert response.status_code == 400
	assert b"Error adding or updating post" in response.data


def test_add_post_invalid_language(app, dbx, client, guard, user, post_details):
	token = guard.encode_jwt_token(user)
	response = client.post(
		'/add-post',
		headers={"Authorization": f"Bearer {token}"},
		json={
			"title": post_details['title'],
			"url": post_details['url'],
			"language": "Gibberish",
			"traveler": post_details['traveler'].value,
			"trip": [tt.name for tt in post_details['trip']],
			"latitude": post_details['latitude'],
			"longitude": post_details['longitude']
		}
	)
	assert response.status_code == 400
	assert b"Error adding or updating post" in response.data


def test_add_post_invalid_traveler(app, dbx, client, guard, user, post_details):
	token = guard.encode_jwt_token(user)
	response = client.post(
		'/add-post',
		headers={"Authorization": f"Bearer {token}"},
		json={
			"title": post_details['title'],
			"url": post_details['url'],
			"language": post_details['language'].value,
			"traveler": "Ozymandias",
			"trip": [tt.name for tt in post_details['trip']],
			"latitude": post_details['latitude'],
			"longitude": post_details['longitude']
		}
	)
	assert response.status_code == 400
	assert b"Error adding or updating post" in response.data


def test_add_post_invalid_trip_list(app, dbx, client, guard, user, post_details):
	token = guard.encode_jwt_token(user)
	response = client.post(
		'/add-post',
		headers={"Authorization": f"Bearer {token}"},
		json={
			"title": post_details['title'],
			"url": post_details['url'],
			"language": post_details['language'].value,
			"traveler": post_details['traveler'].value,
			"trip": ['NotATrip', 'NotATripEither'],
			"latitude": post_details['latitude'],
			"longitude": post_details['longitude']
		}
	)
	assert response.status_code == 400
	assert b"Error adding or updating post" in response.data


def test_add_post_invalid_trip_string(app, dbx, client, guard, user, post_details):
	token = guard.encode_jwt_token(user)
	response = client.post(
		'/add-post',
		headers={"Authorization": f"Bearer {token}"},
		json={
			"title": post_details['title'],
			"url": post_details['url'],
			"language": post_details['language'].value,
			"traveler": post_details['traveler'].value,
			"trip": list(post_details['trip'])[0].name,
			"latitude": post_details['latitude'],
			"longitude": post_details['longitude']
		}
	)
	assert response.status_code == 400
	assert b"Error adding or updating post" in response.data


def test_update_existing_post(app, dbx, client, guard, user, post, post_details):
	orig_post = dbx.session.query(Post).get(1)
	assert orig_post is not None
	assert orig_post.title == post_details['title']
	assert orig_post.trip == post_details['trip']
	assert orig_post.verified is True
	token = guard.encode_jwt_token(user)
	response = client.post(
		'/add-post',
		headers={"Authorization": f"Bearer {token}"},
		json={
			"update_id": 1,
			"title": "An Updated Post Title",
			"url": post_details['url'],
			"language": post_details['language'].value,
			"traveler": post_details['traveler'].value,
			"trip": [tt.name for tt in post_details['trip']],
			"latitude": post_details['latitude'],
			"longitude": post_details['longitude']
		}
	)
	assert response.status_code == 201
	assert b"Post details updated successfully" in response.data
	post = dbx.session.query(Post).get(1)
	assert post is not None
	assert post.title == "An Updated Post Title"
	assert post.trip == post_details['trip']
	assert post.verified is False


def test_update_existing_post_invalid_data(app, dbx, client, guard, user, post, post_details):
	token = guard.encode_jwt_token(user)
	response = client.post(
		'/add-post',
		headers={"Authorization": f"Bearer {token}"},
		json={
			"update_id": 1,
			"title": "An Updated Post Title",
			"url": post_details['url'],
			"language": "Gibberish",
			"traveler": post_details['traveler'].value,
			"trip": [tt.name for tt in post_details['trip']],
			"latitude": post_details['latitude'],
			"longitude": post_details['longitude']
		}
	)
	assert response.status_code == 400
	assert b"Error adding or updating post" in response.data
	post = dbx.session.query(Post).get(1)
	assert post is not None
	assert post.title == post_details['title']
	assert post.verified is True


def test_update_existing_post_invalid_id(app, dbx, client, guard, user, post, post_details):
	token = guard.encode_jwt_token(user)
	response = client.post(
		'/add-post',
		headers={"Authorization": f"Bearer {token}"},
		json={
			"update_id": 2,
			"title": "An Updated Post Title",
			"url": post_details['url'],
			"language": post_details['language'].value,
			"traveler": post_details['traveler'].value,
			"trip": [tt.name for tt in post_details['trip']],
			"latitude": post_details['latitude'],
			"longitude": post_details['longitude']
		}
	)
	assert response.status_code == 400
	assert b"Error adding or updating post" in response.data
	post = dbx.session.query(Post).get(1)
	assert post is not None
	assert post.title == post_details['title']
	assert post.verified is True


def test_delete_post_unauthenticated(app, dbx, client, post):
	response = client.delete(
		'/delete-post/1'
	)
	assert response.status_code == 401
	n_posts = dbx.session.query(Post).count()
	assert n_posts == 1


def test_delete_post_non_admin_user(app, dbx, client, guard, user, post):
	token = guard.encode_jwt_token(user)
	response = client.delete(
		'/delete-post/1',
		headers={"Authorization": f"Bearer {token}"}
	)
	assert response.status_code == 403
	n_posts = dbx.session.query(Post).count()
	assert n_posts == 1


def test_delete_post_admin_user(app, dbx, client, guard, post):
	n_posts_orig = dbx.session.query(Post).count()
	assert n_posts_orig == 1
	test_user = User(
		email='admin@blog-the-world.com',
		password=guard.hash_password('adminPassword'),
		roles='admin',
		is_active=True
	)
	dbx.session.add(test_user)
	dbx.session.commit()
	admin = dbx.session.query(User).filter_by(roles='admin').one()
	assert admin is not None
	token = guard.encode_jwt_token(admin)
	response = client.delete(
		'/delete-post/1',
		headers={"Authorization": f"Bearer {token}"}
	)
	assert response.status_code == 200
	assert b'Post deleted successfully' in response.data
	n_posts_new = dbx.session.query(Post).count()
	assert n_posts_new == 0


def test_delete_post_invalid_id(app, dbx, client, guard, post):
	test_user = User(
		email='admin@blog-the-world.com',
		password=guard.hash_password('adminPassword'),
		roles='admin',
		is_active=True
	)
	dbx.session.add(test_user)
	dbx.session.commit()
	admin = dbx.session.query(User).filter_by(roles='admin').one()
	token = guard.encode_jwt_token(admin)
	response = client.delete(
		'/delete-post/2',
		headers={"Authorization": f"Bearer {token}"}
	)
	assert response.status_code == 404
	assert b'Failed to delete post' in response.data
	n_posts = dbx.session.query(Post).count()
	assert n_posts == 1


def test_verify_post_unauthenticated(app, dbx, client, unverified_post):
	response = client.get(
		'/verify-post/1'
	)
	assert response.status_code == 401
	post = dbx.session.query(Post).get(1)
	assert post.verified is False


def test_verify_post_non_admin_user(app, dbx, client, guard, user, unverified_post):
	token = guard.encode_jwt_token(user)
	response = client.get(
		'/verify-post/1',
		headers={"Authorization": f"Bearer {token}"}
	)
	assert response.status_code == 403
	post = dbx.session.query(Post).get(1)
	assert post.verified is False


def test_verify_post_admin_user(app, dbx, client, guard, unverified_post):
	post_orig = dbx.session.query(Post).get(1)
	assert post_orig.verified is False
	test_user = User(
		email='admin@blog-the-world.com',
		password=guard.hash_password('adminPassword'),
		roles='admin',
		is_active=True
	)
	dbx.session.add(test_user)
	dbx.session.commit()
	admin = dbx.session.query(User).filter_by(roles='admin').one()
	assert admin is not None
	token = guard.encode_jwt_token(admin)
	response = client.get(
		'/verify-post/1',
		headers={"Authorization": f"Bearer {token}"}
	)
	assert response.status_code == 200
	assert b'Post verified successfully' in response.data
	post_new = dbx.session.query(Post).get(1)
	assert post_new.verified is True


def test_verify_post_invalid_id(app, dbx, client, guard, unverified_post):
	test_user = User(
		email='admin@blog-the-world.com',
		password=guard.hash_password('adminPassword'),
		roles='admin',
		is_active=True
	)
	dbx.session.add(test_user)
	dbx.session.commit()
	admin = dbx.session.query(User).filter_by(roles='admin').one()
	token = guard.encode_jwt_token(admin)
	response = client.get(
		'/verify-post/2',
		headers={"Authorization": f"Bearer {token}"}
	)
	assert response.status_code == 404
	assert b'Failed to verify post' in response.data
	post = dbx.session.query(Post).get(1)
	assert post.verified is False


def test_verify_post_already_verified(app, dbx, client, guard, post):
	post_orig = dbx.session.query(Post).get(1)
	assert post_orig.verified is True
	test_user = User(
		email='admin@blog-the-world.com',
		password=guard.hash_password('adminPassword'),
		roles='admin',
		is_active=True
	)
	dbx.session.add(test_user)
	dbx.session.commit()
	admin = dbx.session.query(User).filter_by(roles='admin').one()
	token = guard.encode_jwt_token(admin)
	response = client.get(
		'/verify-post/1',
		headers={"Authorization": f"Bearer {token}"}
	)
	assert response.status_code == 200
	assert b'Post verified successfully' in response.data
	post_new = dbx.session.query(Post).get(1)
	assert post_new.verified is True
