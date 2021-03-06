import React from 'react';
import { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import '../index.css';
import api from '../utils/api';
import auth from '../utils/auth';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import Header from './Header';
import Main from './Main';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Footer from './Footer';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [regStatusError, setRegStatusError] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const history = useHistory();

  // useEffect загрузки данных пользователя и карточки
  React.useEffect(() => {
    Promise.all(
      [
        api.getUserInfo(),
        api.getCardList()
      ])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setLoggedIn(true);
        setEmail(user.email);
        setCards(cards);
        history.push('/');
      })
      .catch((err) => {
        console.log(`При загрузке данных пользователя или карточек ${err}`);
      });
  }, [history]);

  // Регистрация
  function handleSignUp({ email, password }) {
    auth.signUp({ email, password })
      .then((res) => {
        if (res.data) {
          setRegStatusError(false);
          setIsInfoTooltipOpen(true);
          history.push('/sign-in');
        }
      })
      .catch((err) => {
        setRegStatusError(err);
        setIsInfoTooltipOpen(true);
        console.log(`При регистрации ${err}`);
      })
  }

  // Авторизация
  function handleSignIn({ email, password }) {
    auth.signIn({ email, password }) // test@test.com, 12345678
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setEmail(res.email);
          getData();
          history.push('/');
        }
      })
      .catch((err) => {
        setRegStatusError(err);
        setIsInfoTooltipOpen(true);
        console.log(`При авторизации ${err}`);
      })
  }

  // Загрузка данных пользователя и карточек
  function getData() {
    Promise.all(
      [
        api.getUserInfo(),
        api.getCardList()
      ])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch((err) => {
        console.log('Promise.all', err);
      });
  }

  // Выход из учетной записи пользователя
  function handleSignOut() {
    auth.signOut()
      .then((res) => console.log(res.status))
      .catch(err => console.log(`При выходе ${err}`));
    setLoggedIn(false);
    setEmail('')
  }

  function handleEditAvatarClick(){
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick(){
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick(){
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card){
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});
  }

  function handleUpdateUser({name, about}) {
    api.setUserInfo({name, about})
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
      })
    .catch((err) => {
       console.log(`При обновлении данных пользователя ${err}`);
      })
  }

  function handleUpdateAvatar(newAvatarUrl) {
    api.setUserAvatar(newAvatarUrl)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
      })
    .catch((err) => {
       console.log(`При обновлении аватара пользователя ${err}`);
      })
  }

  function handleAddPlaceSubmit({newCardName, newCardUrl}) {
    api.postNewCard({newCardName, newCardUrl})
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
      })
    .catch((err) => {
       console.log(`При добавлении карточки ${err}`);
      })
  }

  // Обработка лайков
  function handleCardLike(card) {
	  // Проверяем, есть ли уже лайк на этой карточке
	  const isLiked = card.likes.some(i => i === currentUser._id);
	  // Отправляем запрос в API и получаем обновлённые данные карточки
	  api.changeLikeCardStatus({isLiked, cardId: card._id})
    .then((newCard) => {
		  // Формируем новый массив на основе имеющегося, подставляя в него новую карточку и обновляем стейт
	    setCards((cards) => cards.map((i) => i._id === card._id ? newCard : i));
	  })
    .catch((err) => {
      console.log(`При обработке лайка ${err}`);
     })
  }

  // Удаление карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
      setCards(cards.filter((i) => i._id !== card._id));
    })
    .catch((err) => {
      console.log(`При удалении карточки ${err}`);
     })
  }


  // Реализуем закрытие popup кнопкой Esc
  useEffect(() => {

    function handleEscClose(evt) {
      if (evt.key ==='Escape') {
        closeAllPopups();
      }
    }
    // Список действий внутри одного хука
    document.addEventListener('keyup', handleEscClose);

    // Возвращаем функцию, которая удаляет эффекты
    return () => {
      document.removeEventListener('keyup', handleEscClose);
    }

  },[]);

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          loggedIn={loggedIn}
          email={email}
          onSignOut={handleSignOut}
        />

        <Switch>
          <Route path="/sign-up">
            <Register
              onRegister={handleSignUp}
            />
          </Route>

          <Route path="/sign-in">
            <Login
              onLogin={handleSignIn}
            />
          </Route>

          <ProtectedRoute
            path="/"
            loggedIn={loggedIn}
            component={Main}
            onEditAvatar = {handleEditAvatarClick}
            onEditProfile = {handleEditProfileClick}
            onAddPlace = {handleAddPlaceClick}
            onCardClick = {handleCardClick}
            onCardLike = {handleCardLike}
            onCardDelete = {handleCardDelete}
            cards = {cards}
          />
        </Switch>

        <Footer />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}/>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}/>

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}/>

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}/>

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          regStatusError={regStatusError}
          onClose={closeAllPopups}
        />

      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
