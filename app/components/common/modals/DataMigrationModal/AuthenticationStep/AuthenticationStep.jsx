import React, { useContext, useReducer } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import NotificationsContext from 'app/context/notificationsContext';
import { YClientAPIUrl } from 'app/utils/constants';
import generateReducerActions from 'app/utils/generateReducerActions';
import styles from './AuthenticationStep.module.scss';

// const initialState = {
//   username: 'dentino.dentus@gmail.com',
//   password: 'tezpd4',
//   partnerToken: 'u8xzkdpkgfc73uektn64',
//   isLoading: false,
// };

const initialState = {
  username: '',
  password: '',
  partnerToken: '',
  isLoading: false,
};

const reducerTypes = {
  setUsername: 'setUsername',
  setPassword: 'setPassword',
  setPartnerToken: 'setPartnerToken',
  setIsLoading: 'setIsLoading',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setPassword:
      return { ...state, password: action.payload };
    case reducerTypes.setUsername:
      return { ...state, username: action.payload };
    case reducerTypes.setPartnerToken:
      return { ...state, partnerToken: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const AuthenticationStep = ({ onLogin }) => {
  const textForKey = useTranslate();
  const toast = useContext(NotificationsContext);
  const [{ username, password, partnerToken, isLoading }, localDispatch] =
    useReducer(reducer, initialState);

  const handleFormChange = (targetId) => (newValue) => {
    switch (targetId) {
      case 'username':
        localDispatch(actions.setUsername(newValue));
        break;
      case 'password':
        localDispatch(actions.setPassword(newValue));
        break;
      case 'partnerToken':
        localDispatch(actions.setPartnerToken(newValue));
        break;
    }
  };

  const isFormValid = () => {
    return (
      username.length > 0 && password.length > 0 && partnerToken.length > 0
    );
  };

  const handleLogin = async () => {
    localDispatch(actions.setIsLoading(true));
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${partnerToken}`,
        Accept: 'application/vnd.yclients.v2+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: username,
        password,
      }),
    };
    const response = await fetch(`${YClientAPIUrl}/v1/auth`, requestOptions);
    const responseData = await response.json();
    if (!responseData.success) {
      toast.error(responseData.meta.message);
    } else {
      onLogin({ ...responseData.data, partnerToken });
    }
    localDispatch(actions.setIsLoading(false));
  };

  return (
    <div className={styles['authentication-step']}>
      <Typography classes={{ root: styles['form-title'] }}>
        {textForKey('authenticate with yclients account')}
      </Typography>
      <EASTextField
        type='email'
        containerClass={styles.simpleField}
        fieldLabel={textForKey('username')}
        value={username}
        onChange={handleFormChange('username')}
      />
      <EASTextField
        type='password'
        containerClass={styles.simpleField}
        fieldLabel={textForKey('password')}
        value={password}
        onChange={handleFormChange('password')}
      />
      <EASTextField
        type='text'
        containerClass={styles.simpleField}
        fieldLabel={textForKey('partner token')}
        value={partnerToken}
        onChange={handleFormChange('partnerToken')}
      />
      <LoadingButton
        onClick={handleLogin}
        className='positive-button'
        disabled={!isFormValid() || isLoading}
        isLoading={isLoading}
      >
        {textForKey('login')}
      </LoadingButton>

      <Typography classes={{ root: styles['explanation-label'] }}>
        {textForKey('yclients_auth_explanation')}
      </Typography>
    </div>
  );
};

export default AuthenticationStep;

AuthenticationStep.propTypes = {
  onLogin: PropTypes.func,
};

AuthenticationStep.defaultProps = {
  onLogin: () => null,
};
