import { Link } from "react-router-dom";
import IdentityForm from "./IdentityForm";

function Register({ onRegister }) {
  return(
    <IdentityForm
      title="Регистрация"
      buttonText="Зарегистрироваться"
      onFormSubmit={onRegister}
    >
      <Link to="/signin" className="form__link">
        Уже зарегистрированы? Войти
      </Link>
    </IdentityForm>
  );
}

export default Register;
