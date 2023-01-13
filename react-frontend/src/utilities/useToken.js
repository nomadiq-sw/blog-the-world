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

import { useState } from 'react'

const useToken = () => {
  const getToken = () => {
    const userToken = localStorage.getItem('token')
    return userToken && userToken
  }

  const [token, setToken] = useState(getToken())

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken)
    setToken(userToken)
  }

  const removeToken = () => {
    localStorage.removeItem("token")
    setToken(null)
  }

  return {
    setToken: saveToken,
    getToken,
    removeToken
  }

}

export default useToken
