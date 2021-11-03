import { apiSettings } from "./utils";

class Api {
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

  // Получение информации о пользователе с сервера
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      credentials: 'include', // теперь куки посылаются вместе с запросом
      headers: this._headers
    })
    .then(this._checkResponse)
  }

  // Загрузка новой информации о пользователе на сервер
  setUserInfo({name, about}) {
    return fetch(`${this._baseUrl}/users/me`, {
    method: 'PATCH',
    credentials: 'include',
    headers: this._headers,
    body: JSON.stringify({
      name: name,
      about: about
      })
    })
    .then(this._checkResponse)
  }

  // Загрузка аватара пользователя на сервер
  setUserAvatar(newAvatarUrl) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    credentials: 'include',
    headers: this._headers,
    body: JSON.stringify({
      avatar: newAvatarUrl,
      })
    })
    .then(this._checkResponse)
  }

  // Получение массива карточек с сервера
  getCardList() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      credentials: 'include',
      headers: this._headers
    })
    .then(this._checkResponse)
  }

  // Загрузка новой карточки на сервер
  postNewCard({newCardName, newCardUrl}) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: newCardName,
        link: newCardUrl
        })
    })
    .then(this._checkResponse)
  }

  // Лайк и удаление лайка карточки
  changeLikeCardStatus({isLiked, cardId}) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: `${isLiked ? 'DELETE' : 'PUT'}`,
      credentials: 'include',
      headers: this._headers
    })
    .then(this._checkResponse)
  }

  // Удаление карточки на сервере
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this._headers
    })
    .then(this._checkResponse)
  }

}


// Создаем экземпляр класса взаимодействия с API сервера
const api = new Api(apiSettings);


export default api;
