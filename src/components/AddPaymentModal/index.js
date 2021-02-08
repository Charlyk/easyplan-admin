import React, { useEffect, useReducer } from 'react';

import PropTypes from 'prop-types';
import { Form, FormControl, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { togglePatientPaymentsUpdate } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import {
  adjustValueToNumber,
  generateReducerActions,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const initialState = {
  amount: 0,
  discount: 0,
  comment: '',
  isLoading: false,
};

const reducerTypes = {
  setAmount: 'setAmount',
  setDiscount: 'setDiscount',
  setComment: 'setComment',
  setIsLoading: 'setIsLoading',
  resetState: 'resetState',
};

const actions = generateReducerActions(reducerTypes);

/**
 * Add payment modal reducer
 * @param {Object} state
 * @param {{ type: string, payload: any }} action
 */
const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setAmount:
      return { ...state, amount: action.payload };
    case reducerTypes.setComment:
      return { ...state, comment: action.payload };
    case reducerTypes.setDiscount:
      return { ...state, discount: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.resetState:
      return initialState;
    default:
      return state;
  }
};

const AddPaymentModal = ({ open, patient, onClose }) => {
  const dispatch = useDispatch();
  const [{ amount, discount, comment, isLoading }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    if (!open) {
      localDispatch(actions.resetState());
    }
  }, [open]);

  const handleAddPayment = async () => {
    if (!isFormValid()) return;
    localDispatch(actions.setIsLoading(true));
    const response = await dataAPI.addPatientPurchase(patient.id, {
      amount,
      discount,
      comment,
    });
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      toast.success(textForKey('Payment registered'));
      dispatch(togglePatientPaymentsUpdate());
      onClose();
    }
  };

  const handleCommentChange = event => {
    localDispatch(actions.setComment(event.target.value));
  };

  const handleAmountChange = event => {
    const newValue = adjustValueToNumber(event.target.value, Number.MAX_VALUE);
    localDispatch(actions.setAmount(newValue));
  };

  const handleDiscountChange = event => {
    const newValue = adjustValueToNumber(event.target.value, 100);
    localDispatch(actions.setDiscount(newValue));
  };

  const isFormValid = () => {
    return comment.length > 0 && amount > 0;
  };

  return (
    <EasyPlanModal
      onClose={onClose}
      open={open}
      size='sm'
      className='add-payment-root'
      title={textForKey('Add payment')}
      isPositiveDisabled={!isFormValid() || isLoading}
      onPositiveClick={handleAddPayment}
      isPositiveLoading={isLoading}
    >
      <Form.Label>{textForKey('Amount')}</Form.Label>
      <InputGroup>
        <FormControl
          type='number'
          onChange={handleAmountChange}
          value={String(amount)}
        />
        <InputGroup.Append>
          <InputGroup.Text id='basic-addon1'>MDL</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
      <Form.Label>{textForKey('Discount')}</Form.Label>
      <InputGroup>
        <FormControl
          className='discount-form-control'
          type='number'
          max={100}
          onChange={handleDiscountChange}
          value={String(discount)}
        />
        <InputGroup.Append>
          <InputGroup.Text id='basic-addon1'>%</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
      <Form.Group controlId='comment'>
        <Form.Label>{textForKey('Paid for')}:</Form.Label>
        <Form.Control
          as='textarea'
          value={comment}
          onChange={handleCommentChange}
          aria-label='With textarea'
        />
      </Form.Group>
    </EasyPlanModal>
  );
};

export default AddPaymentModal;

AddPaymentModal.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.number,
  }),
};
