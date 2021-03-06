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

  // Выход из профиля
  signOut() {
    return fetch(
      `${this.baseUrl}/users/signout`,
      {
        method: 'GET',
        credentials: 'include',
      })
    .then((res) => {
      if (res.ok) {
        return res;
      }
      return Promise.reject(`произошла ошибка: ${res.status}`);
    }
    );
  }

}

const auth = new Auth(apiSettings);
export default auth;
