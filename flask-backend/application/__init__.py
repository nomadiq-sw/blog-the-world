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
import logging
import os
from flask import Flask
from flask_migrate import Migrate
from flask_mail import Mail
from .models import db, User
from .routes import api, guard, cors


def create_app(test_config=None):
	app = Flask(__name__, instance_relative_config=False)
	app.register_blueprint(api)

	if test_config is None:
		app.config.from_pyfile('config.py', silent=True)
		logging.info("Running with full config")
	else:
		app.config.from_pyfile(test_config)
		logging.info("Running with test config")

	try:
		os.makedirs(app.instance_path)
	except OSError:
		pass

	db.init_app(app)
	Migrate(app, db)

	guard.init_app(app, User)
	cors.init_app(app, resources={r'*': {'origins': ['https://blogtheworld.co', 'http://localhost:3000']}})

	Mail(app)

	return app
