// Copyright 2023 Owen M. Jones. All rights reserved.
//
// This file is part of BlogTheWorld.
//
// BlogTheWorld is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License
// as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
// BlogTheWorld is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with BlogTheWorld. If not, see <https://www.gnu.org/licenses/>.

import axios from "axios"

const validateRecaptcha = (formValidityRef) => {
  if (formValidityRef.current) {
    return (
      Promise.resolve(
        // eslint-disable-next-line no-undef
        () => grecaptcha.ready()
      ).then(
        // eslint-disable-next-line no-undef
				() => grecaptcha.execute(process.env.REACT_APP_RECAPTCHA_SITE_KEY, {action: 'submit'})
      ).then(
        (token) => axios.get(process.env.REACT_APP_FLASK_API_URL + '/validate-recaptcha/' + token)
      ).then(
        (response) => Promise.resolve(response.status === 204)
      )
    )
  }
  else { return Promise.resolve(false) }
}

export default validateRecaptcha
