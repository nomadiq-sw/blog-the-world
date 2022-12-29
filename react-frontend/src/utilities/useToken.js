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
