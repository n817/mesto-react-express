import { apiSettings } from "./utils";

class Auth {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // Проверка ответа сервера
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`произошла ошибка: ${res.status}`);
  }

  // Регистрация
  signUp({ email, password }) {
    return fetch(`${this._baseUrl}/signup`,
      {
        method: 'POST',
        credentials: 'include',
        headers: this._headers,
        body: JSON.stringify({ password, email })
      }
    )
    .then(this._checkResponse);
  }

  // Авторизация
  signIn({ email, password }) {
    return fetch(
      `${this._baseUrl}/signin`,
      {
        method: 'POST',
        credentials: 'include',
        headers: this._headers,
        body: JSON.stringify({password, email})
      }
    )
    .then(this._checkResponse);
  }

  // Проверка токена
  tokenCheck(token) {
    return fetch(
      `${this._baseUrl}/users/me`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token}`
        }
      }
    )
    .then(this._checkResponse);
  }

}

const auth = new Auth(apiSettings);
export default auth;
