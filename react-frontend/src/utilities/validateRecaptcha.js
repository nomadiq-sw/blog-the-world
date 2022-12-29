import axios from "axios";

const validateRecaptcha = (formValidityRef) => {
  if (formValidityRef.current) {
    return (
      Promise.resolve(
        () => grecaptcha.ready()
      ).then(
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
