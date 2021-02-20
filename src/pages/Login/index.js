import React, { useState } from 'react';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ResetPassword from './components/ResetPassword';

const FormType = {
  login: 'login',
  resetPassword: 'resetPassword',
  register: 'register',
};

const Login = () => {
  const [currentForm, setCurrentForm] = useState(FormType.login);

  const handleResetPasswordBack = () => {
    setCurrentForm(FormType.login);
  };

  const handleResetPassword = () => {
    setCurrentForm(FormType.resetPassword);
  };

  const handleSignUp = () => {
    setCurrentForm(FormType.register);
  };

  return (
    <div className='login-form-root'>
      <div className='logo-container'>
        <img
          src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
          alt='EasyPlan'
        />
      </div>
      <div className='form-container'>
        {currentForm === FormType.login && (
          <LoginForm
            onSignUp={handleSignUp}
            onResetPassword={handleResetPassword}
          />
        )}
        {currentForm === FormType.resetPassword && (
          <ResetPassword onGoBack={handleResetPasswordBack} />
        )}
        {currentForm === FormType.register && (
          <RegisterForm onGoBack={handleResetPasswordBack} />
        )}
      </div>
    </div>
  );
};

export default Login;
