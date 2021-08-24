import React, { useReducer } from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress'
import VisibilityOn from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup'
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';
import { useRouter } from "next/router";
import axios from "axios";

import IconAvatar from '../../components/icons/iconAvatar';
import LoadingButton from '../../components/common/LoadingButton';
import { JwtRegex, PasswordRegex, Role } from '../../app/utils/constants';
import {
  generateReducerActions,
  uploadFileToAWS,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import isPhoneInputValid from "../../app/utils/isPhoneInputValid";
import styles from '../../styles/AcceptInvitation.module.scss';
import isPhoneNumberValid from "../../app/utils/isPhoneNumberValid";

const initialState = {
  isLoading: false,
  firstName: '',
  lastName: '',
  phoneNumber: '',
  isPhoneValid: true,
  password: '',
  avatarFile: null,
  isInvitationAccepted: false,
  isPasswordVisible: false,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setFirstName: 'setFirstName',
  setLastName: 'setLastName',
  setPhoneNumber: 'setPhoneNumber',
  setIsPhoneValid: 'setIsPhoneValid',
  setPassword: 'setPassword',
  setAvatarFile: 'setAvatarFile',
  setIsInvitationAccepted: 'setIsInvitationAccepted',
  setIsPasswordVisible: 'setIsPasswordVisible',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setFirstName:
      return { ...state, firstName: action.payload };
    case reducerTypes.setLastName:
      return { ...state, lastName: action.payload };
    case reducerTypes.setPhoneNumber:
      return {
        ...state,
        phoneNumber: action.payload.number,
        isPhoneValid: action.payload.isValid,
      };
    case reducerTypes.setIsPhoneValid:
      return { ...state, isPhoneValid: action.payload };
    case reducerTypes.setPassword:
      return { ...state, password: action.payload };
    case reducerTypes.setAvatarFile:
      return { ...state, avatarFile: action.payload };
    case reducerTypes.setIsInvitationAccepted:
      return { ...state, isInvitationAccepted: action.payload };
    case reducerTypes.setIsPasswordVisible:
      return { ...state, isPasswordVisible: action.payload };
    default:
      return state;
  }
};

const AcceptInvitation = () => {
  const router = useRouter();
  const { isNew, token } = router.query;
  const isNewUser = isNew === '1';
  const [
    {
      isLoading,
      firstName,
      lastName,
      phoneNumber,
      isPhoneValid,
      password,
      avatarFile,
      isPasswordVisible,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  if (!token.match(JwtRegex)) {
    router.replace('/login');
    return null;
  }

  const handleFirstNameChange = event => {
    localDispatch(actions.setFirstName(event.target.value));
  };

  const handleLastNameChange = event => {
    localDispatch(actions.setLastName(event.target.value));
  };

  const handleAvatarChange = event => {
    const files = event.target.files;
    if (files != null) {
      localDispatch(actions.setAvatarFile(files[0]));
    }
  };

  const handlePhoneNumberChange = (value, country, event) => {
    localDispatch(
      actions.setPhoneNumber({
        number: `+${value}`,
        isValid: isPhoneNumberValid(value, country) && !event.target?.classList.value.includes('invalid-number'),
      }),
    );
  };

  const handlePasswordChange = event => {
    localDispatch(actions.setPassword(event.target.value));
  };

  const togglePasswordVisibility = () => {
    localDispatch(actions.setIsPasswordVisible(!isPasswordVisible));
  };

  const isFormValid = () => {
    return (
      password.match(PasswordRegex) &&
      firstName.length > 2 &&
      lastName.length > 2 &&
      isPhoneValid
    );
  };

  const handleSuccessResponse = async (user) => {
    const selectedClinic = user.clinics.find((clinic) => clinic.isSelected) || user.clinics[0];
    if (selectedClinic != null) {
      switch (selectedClinic.roleInClinic) {
        case Role.reception:
          await router.replace('/calendar/day');
          break;
        case Role.admin:
        case Role.manager:
          await router.replace('/analytics/general');
          break;
        default:
          await router.replace('/login');
          break;
      }
    } else {
      await router.replace('/login');
    }
  }

  const handleAcceptInvitation = async () => {
    if (isNewUser && !isFormValid()) {
      return;
    }
    localDispatch(actions.setIsLoading(true));
    try {
      const requestBody = {
        firstName,
        lastName,
        password,
        phoneNumber,
        invitationToken: token,
      };
      if (avatarFile != null) {
        const uploadResult = await uploadFileToAWS('avatars', avatarFile);
        if (uploadResult?.location != null) {
          requestBody.avatar = uploadResult.location;
        }
      }
      const { data: user } = await axios.put(
        `/api/users/accept-invitation`,
        requestBody
      );
      toast.success(textForKey('invitation_accepted_success'));
      await handleSuccessResponse(user)
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  };

  return (
    <div className={styles['general-page']}>
      <div className={styles['logo-container']}>
        <img
          src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
          alt='EasyPlan'
        />
      </div>
      <div className={styles['form-container']}>
        <div className={clsx(styles['form-root'], styles['accept-invitation'])}>
          {!isNewUser && isLoading && (
            <div className='progress-bar-wrapper'>
              <CircularProgress className='circular-progress-bar'/>
            </div>
          )}
          {isNewUser ? (
            <div className={styles['form-wrapper']}>
              <span className={styles['form-title']}>
                {textForKey('Accept invitation')}
              </span>
              <span className={styles['welcome-text']}>
                {textForKey('accept invitation message')}
              </span>
              <div className='upload-avatar-container'>
                {avatarFile ? (
                  <Image roundedCircle src={avatarFile}/>
                ) : (
                  <IconAvatar/>
                )}
                <span style={{ margin: '1rem' }}>
                  {textForKey('JPG or PNG, Max size of 800kb')}
                </span>
                <Form.Group>
                  <input
                    className='custom-file-button'
                    type='file'
                    name='avatar-file'
                    id='avatar-file'
                    accept='.jpg,.jpeg,.png'
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor='avatar-file'>
                    {textForKey('Upload image')}
                  </label>
                </Form.Group>
              </div>
              <Form.Group controlId='lastName'>
                <Form.Label>{textForKey('Last name')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    value={lastName}
                    type='text'
                    onChange={handleLastNameChange}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='firstName'>
                <Form.Label>{textForKey('First name')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    value={firstName}
                    type='text'
                    onChange={handleFirstNameChange}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='phoneNumber'>
                <Form.Label>{textForKey('Phone number')}</Form.Label>
                <InputGroup>
                  <PhoneInput
                    onChange={handlePhoneNumberChange}
                    value={phoneNumber}
                    alwaysDefaultMask
                    countryCodeEditable={false}
                    country='md'
                    placeholder='079123456'
                    isValid={isPhoneInputValid}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='newPassword'>
                <Form.Label>{textForKey('Enter a new password')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    autoComplete='new-password'
                    value={password}
                    onChange={handlePasswordChange}
                    type={isPasswordVisible ? 'text' : 'password'}
                  />
                  <InputGroup.Append className={styles['password-visibility-append']}>
                    <Button
                      onClick={togglePasswordVisibility}
                      variant='outline-primary'
                      className={styles['visibility-toggle-btn']}
                    >
                      {isPasswordVisible ? <VisibilityOff/> : <VisibilityOn/>}
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
                <Form.Text className='text-muted'>
                  {textForKey('passwordValidationMessage')}
                </Form.Text>
              </Form.Group>
            </div>
          ) : (
            <div>
              <Typography className={styles['form-title']}>{textForKey('Accept invitation')}</Typography>
              <span className={styles['welcome-text']}>
                {textForKey('Click on button below to accept the invitation')}
              </span>
            </div>
          )}
          <div className={clsx(styles['footer'], !isNewUser && styles['is-new'])}>
            <LoadingButton
              isLoading={isLoading}
              disabled={isLoading}
              className='positive-button'
              onClick={handleAcceptInvitation}
            >
              {textForKey('Accept invitation')}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = () => {
  return {
    props: {}
  }
}

export default AcceptInvitation;
