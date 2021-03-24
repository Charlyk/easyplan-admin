import React, { useCallback, useEffect, useReducer } from "react";
import RegisterForm from "./RegisterForm";
import { generateReducerActions, uploadFileToAWS } from "../../../utils/helperFuncs";
import { StepLabel, Stepper, Step } from "@material-ui/core";
import { textForKey } from "../../../utils/localization";
import styles from '../../../styles/RegistrationWrapper.module.scss';
import CreateClinicForm from "./CreateClinicForm";
import { toast } from "react-toastify";
import { registerUser } from "../../../middleware/api/auth";
import { createNewClinic } from "../../../middleware/api/clinic";
import { useRouter } from "next/router";

const RegistrationStep = {
  Account: 0,
  Clinic: 1
}

const RegistrationSteps = [
  textForKey('Account'),
  textForKey('Clinic'),
];

const initialState = {
  step: RegistrationStep.Account,
  isLoading: false,
  errorMessage: null,
  completedSteps: [],
  accountData: null,
  clinicData: null,
};

const reducerTypes = {
  setStep: 'setStep',
  setAccountCompleted: 'setAccountCompleted',
  setIsLoading: 'setIsLoading',
  setErrorMessage: 'setErrorMessage',
  setCompletedSteps: 'setCompletedSteps',
  setAccountData: 'setAccountData',
  setClinicData: 'setClinicData',
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setAccountData:
      return { ...state, accountData: action.payload };
    case reducerTypes.setStep:
      return { ...state, step: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setErrorMessage:
      return { ...state, errorMessage: action.payload };
    case reducerTypes.setCompletedSteps:
      return { ...state, completedSteps: action.payload };
    case reducerTypes.setClinicData:
      return { ...state, clinicData: action.payload };
    case reducerTypes.setAccountCompleted:
      return {
        ...state,
        step: RegistrationStep.Clinic,
        completedSteps: [
          RegistrationStep.Account,
        ],
      }
    default:
      return state;
  }
};

const actions = generateReducerActions(reducerTypes);

const RegistrationWrapper = ({ onGoBack }) => {
  const [{
    step,
    isLoading,
    errorMessage,
    completedSteps,
    accountData,
    clinicData,
  }, localDispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    if (accountData == null) {
      return;
    }

    handleCreateAccount();
  }, [accountData]);

  useEffect(() => {
    if (clinicData == null) {
      return;
    }

    handleCreateClinic();
  }, [clinicData])

  const handleCreateAccount = async () => {
    localDispatch(actions.setIsLoading(true));
    try {
      if (accountData.avatarFile != null) {
        const uploadResult = await uploadFileToAWS('avatars', accountData.avatarFile);
        accountData.avatar = uploadResult?.location;
        delete accountData.avatarFile;
      }
      await registerUser(accountData);
      localDispatch(actions.setAccountCompleted());
      toast.success(textForKey('account_created_success'))
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  }

  const handleCreateClinic = async () => {
    localDispatch(actions.setIsLoading(true));
    try {
      if (clinicData.logoFile != null) {
        const uploadResult = await uploadFileToAWS('avatars', clinicData.logoFile);
        clinicData.logo = uploadResult?.location;
        delete clinicData.logoFile;
      }
      await createNewClinic(clinicData);
      await router.replace('/analytics/general');
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  }

  const handleAccountSubmit = (data) => {
    localDispatch(actions.setAccountData(data));
  }

  const handleClinicSubmit = (data) => {
    localDispatch(actions.setClinicData(data));
  }

  const handleGoBack = () => {
    onGoBack();
  }

  const isStepCompleted = useCallback((step) => {
    return completedSteps.includes(step);
  }, [completedSteps]);

  return (
    <div className={styles.registrationWrapper}>
      {step === RegistrationStep.Account && (
        <RegisterForm
          onSubmit={handleAccountSubmit}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onGoBack={handleGoBack}
        />
      )}
      {step === RegistrationStep.Clinic && (
        <CreateClinicForm
          onSubmit={handleClinicSubmit}
          onGoBack={handleGoBack}
          isLoading={isLoading}
        />
      )}
      <Stepper activeStep={step} className={styles.stepperRoot}>
        {RegistrationSteps.map((label, index) => (
          <Step key={label} completed={isStepCompleted(index)}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  )
}

export default RegistrationWrapper;
