import { useState } from 'react'

function useToken() {
  const [token, setToken] = useState(getToken())

  function getToken() {
    const userToken = localStorage.getItem('token')
    return userToken && userToken
  }

  function saveToken(userToken) {
    localStorage.setItem('token', userToken)
    setToken(userToken)
  }

  function removeToken() {
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
