import React, { useEffect, useMemo, useReducer } from "react";
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy'
import { CSVReader } from "react-papaparse";
import Image from "next/image";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";

import IconsUploadCSV from "../../../../components/icons/iconsUploadCSV";
import BendArrow from "../../../../public/bend-arrow.png";
import { textForKey } from "../../../../utils/localization";
import EASModal from "../modals/EASModal";
import reducer, {
  initialState,
  setData,
  setMappedFields,
  resetState,
} from './csvImportSlice';
import styles from './CSVImportModal.module.scss';

const CSVImportModal = ({ open, fields, onImport, onClose }) => {
  const [{ data, file, mappedFields }, localDispatch] = useReducer(reducer, initialState);

  const btnTitle = useMemo(() => {
    if (file === null) {
      return 'OK';
    }

    return textForKey('import_n_patients')
      .replace('#', `${data.length - 1}`)
  }, [data, file]);

  const isFormValid = useMemo(() => {
    const requiredFields = fields.filter(item => item.required).map(item => item.id).sort();
    const selectedRequired = mappedFields.filter(item => item.required).map(item => item.id).sort();
    return isEqual(requiredFields, selectedRequired);
  }, [mappedFields]);

  useEffect(() => {
    if (!open) {
      localDispatch(resetState());
    }
  }, [open])

  const handleOnDrop = (data, file) => {
    localDispatch(setData({ data, file }));
  };

  const handleUploadFile = () => {
    if (!isFormValid) {
      return;
    }

    onImport?.(file, mappedFields);
  }

  const handleFieldSelected = (fieldId, index) => {
    const field = fields.find(item => item.id === fieldId);
    const selectedField = mappedFields.find(item => item.id === fieldId);

    if (selectedField != null && selectedField.index !== index) {
      localDispatch(setMappedFields(mappedFields
        .map(item => {
          if (item.id !== selectedField.id) {
            return item;
          }

          return { ...item, index }
        }))
      );
      return;
    }

    const indexExists = mappedFields.some(item => item.index === index);
    if (indexExists) {
      localDispatch(setMappedFields(mappedFields.map(item => {
        if (item.index !== index) {
          return item;
        }
        return { ...field, index };
      })));
      return;
    }

    localDispatch(setMappedFields([...mappedFields, { ...field, index }]));
  };

  const fieldForIndex = (index) => {
    return mappedFields.find(item => item.index === index);
  }

  const renderSelectedFields = (fieldId) => {
    const field = mappedFields.find(item => item.id === fieldId);
    return field?.name ?? `${textForKey('Choose match')}...`;
  }

  return (
    <EASModal
      open={open}
      onClose={onClose}
      className={styles.importModal}
      paperClass={styles.modalPaper}
      onBackdropClick={() => null}
      primaryBtnText={btnTitle}
      onPrimaryClick={handleUploadFile}
      note={data.length > 0 && textForKey('patients_import_note')}
      title={textForKey('Import patients')}
    >
      <div className={styles.modalBody}>
        {data.length === 0 ? (
          <Box padding="16px">
            <CSVReader
              onDrop={handleOnDrop}
              style={{ margin: '16px !important' }}
              addRemoveButton
              removeButtonColor='#659cef'
            >
              <IconsUploadCSV/>
            </CSVReader>
          </Box>
        ) : (
          <TableContainer className={styles.tableContainer}>
            <Table className={styles.table}>
              <TableHead className={styles.tableHead}>
                {data.slice(0, 1).map((item, index) => (
                  <TableRow key={`header-row-${item.data.join(';')}-${index}`} className={styles.tableRow}>
                    {item.data.map((value, index) => (
                      <TableCell
                        className={styles.tableCell}
                        key={`header-cell-${value}-${index}`}
                      >
                        <div className={styles.dataContainer}>
                          <Image src={BendArrow} alt="" width={8} height={4}/>
                          <Typography noWrap className={styles.label}>{value || '-'}</Typography>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {data.slice(0, 1).map((row, rowIndex) => (
                  <TableRow key={`select-row-${row.data.join(';')}-${rowIndex}`} className={styles.tableRow}>
                    {row.data.map((cell, cellIndex) => (
                      <TableCell key={`select-cell-${cell}-${cellIndex}`} className={styles.selectCell}>
                        <div className={styles.dataContainer}>
                          <Select
                            disableUnderline
                            labelId={`select-cell-${cell}-${cellIndex}`}
                            value={fieldForIndex(cellIndex)?.id ?? 'none'}
                            renderValue={renderSelectedFields}
                            onChange={(event) => handleFieldSelected(event.target.value, cellIndex)}
                          >
                            <MenuItem
                              value="none"
                              className={styles.menuItemRoot}
                            >
                              <Typography className={styles.menuItemText}>
                                {`${textForKey('Choose match')}...`}
                              </Typography>
                            </MenuItem>
                            {fields.map((field) => (
                              <MenuItem
                                key={field.id}
                                value={field.id}
                                className={styles.menuItemRoot}
                              >
                                <Typography className={styles.menuItemText}>
                                  {field.name}
                                </Typography>
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody className={styles.tableBody}>
                {data.slice(1, 10).map((item, index) => (
                  <TableRow key={`value-row-${item.data.join(';')}-${index}`} className={styles.tableRow}>
                    {item.data.map((value, index) => (
                      <TableCell
                        className={styles.tableCell}
                        key={`value-cell-${value}-${index}`}
                      >
                        <Typography noWrap className={styles.label}>{value}</Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </EASModal>
  );
};

export default CSVImportModal;

CSVImportModal.propTypes = {
  open: PropTypes.bool,
  csvFile: PropTypes.any,
  onClose: PropTypes.func,
  onImport: PropTypes.func,
  fields: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    required: PropTypes.bool,
  })),
};

CSVImportModal.defaultProps = {
  fields: [],
};
