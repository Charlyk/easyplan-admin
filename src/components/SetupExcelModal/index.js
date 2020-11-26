import React from 'react';

import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'react-bootstrap';

import IconClose from '../../assets/icons/iconClose';
import { textForKey } from '../../utils/localization';
import './styles.scss';
import LoadingButton from '../LoadingButton';
import IconSuccess from '../../assets/icons/iconSuccess';

const SetupExcelModal = ({ open, data, onClose }) => {
  if (data == null) {
    return null;
  }

  const handleCellTypeSelected = event => {};

  return (
    <Modal
      centered
      show={open}
      size='xl'
      onHide={onClose}
      className='setup-excel-modal easyplan-modal'
    >
      <Modal.Header>
        {textForKey('Setup columns')}
        <div
          role='button'
          tabIndex={0}
          onClick={onClose}
          className='close-modal-btn'
        >
          <IconClose />
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className='table-container'>
          <table>
            <thead>
              <tr>
                {data.table.rows[0].cells.map(cell => (
                  <td
                    align='center'
                    valign='center'
                    key={`${cell.columnIndex}-head-cell`}
                  >
                    <Form.Group>
                      <Form.Control
                        onChange={handleCellTypeSelected}
                        as='select'
                        className='mr-sm-2'
                        id={`${cell.columnIndex}`}
                        custom
                      >
                        <option value='None'>--</option>
                        {data.cellTypes.map(item => (
                          <option key={item} value={item}>
                            {textForKey(item)}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.table.rows.map(row => (
                <tr key={`${row.rowNumber}-body-row`}>
                  {row.cells.map(cell => (
                    <td key={`${cell.columnIndex}-${row.rowNumber}-cell`}>
                      {cell.cellValue}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='cancel-button' onClick={onClose}>
          {textForKey('Close')}
          <IconClose />
        </Button>
        <LoadingButton className='positive-button'>
          {textForKey('Save')}
          <IconSuccess fill='#FFF' />
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};

export default SetupExcelModal;

SetupExcelModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.shape({
    cellTypes: PropTypes.arrayOf(PropTypes.string),
    table: PropTypes.shape({
      fileName: PropTypes.string,
      fileUrl: PropTypes.string,
      rows: PropTypes.arrayOf(
        PropTypes.shape({
          rowNumber: PropTypes.number,
          cells: PropTypes.arrayOf(
            PropTypes.shape({
              columnIndex: PropTypes.number,
              cellValue: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
              ]),
              cellType: PropTypes.string,
            }),
          ),
        }),
      ),
    }),
  }),
  onClose: PropTypes.func,
};
