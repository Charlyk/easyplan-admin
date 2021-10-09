import React, { useEffect, useMemo, useReducer } from "react";
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
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
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

import IconsUploadCSV from "../../icons/iconsUploadCSV";
import BendArrow from "../../../../public/bend-arrow.png";
import { textForKey } from "../../../utils/localization";
import getCSVRowsCount from "../../../utils/getCSVRowsCount";
import EASModal from "../modals/EASModal";
import reducer, {
  initialState,
  setData,
  setMappedFields,
  resetState,
  setSnackbar,
} from './csvImportSlice';
import styles from './CSVImportModal.module.scss';

const maxAllowedRows = 10000;

const CSVImportModal = ({ open, title, iconTitle, iconSubtitle, importBtnTitle, note, fields, isLoading, onImport, onClose }) => {
  const [{ data, file, mappedFields, snackbar, rowsCount }, localDispatch] = useReducer(reducer, initialState);

  const btnTitle = useMemo(() => {
    if (file === null) {
      return 'OK';
    }

    return importBtnTitle
      .replace('#', `${rowsCount - 1}`) // subtract one row for the title row
  }, [data, file, importBtnTitle]);

  const isFormValid = useMemo(() => {
    const requiredFields = fields.filter(item => item.required).map(item => item.id).sort();
    const selectedRequired = mappedFields.filter(item => item.required).map(item => item.id).sort();
    return isEqual(requiredFields, selectedRequired);
  }, [mappedFields, fields]);

  const pendingFields = useMemo(() => {
    const requiredFields = fields.filter(item => item.required).map(item => item.id).sort();
    const selectedRequired = mappedFields.filter(item => item.required).map(item => item.id).sort();
    const difference = requiredFields.filter(item => !selectedRequired.includes(item));
    const pendingFields = fields.filter(item => difference.includes(item.id));
    return pendingFields.map(item => item.name);
  }, [mappedFields, fields])

  useEffect(() => {
    if (!open) {
      localDispatch(resetState());
    }
  }, [open])

  const handleOnDrop = async (data, file) => {
    const rowsCount = await getCSVRowsCount(file);
    if ((rowsCount - 1) > maxAllowedRows) {
      localDispatch(setSnackbar({ show: true, message: textForKey('csv_max_rows_exceeded')}));
      return;
    }
    localDispatch(setData({ data, file, rowsCount }));
  };

  const handleUploadFile = () => {
    if (!isFormValid) {
      localDispatch(
        setSnackbar({
          show: true,
          message: textForKey('map_all_fields').replace('#', pendingFields.join(', '))
        })
      );
      return;
    }

    onImport?.(file, mappedFields);
  };

  const handleFieldSelected = (fieldId, index) => {
    const field = fields.find(item => item.id === fieldId);
    const selectedField = mappedFields.find(item => item.id === fieldId);

    if (fieldId === 'none') {
      localDispatch(setMappedFields(mappedFields.filter(item => item.index !== index)));
      return;
    }

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
  };

  const renderSelectedFields = (fieldId) => {
    const field = mappedFields.find(item => item.id === fieldId);
    return field?.name ?? `${textForKey('Choose match')}...`;
  };

  const handleSnackbarClose = () => {
    localDispatch(setSnackbar({ show: false, message: '' }));
  };

  return (
    <EASModal
      open={open}
      onClose={onClose}
      className={styles.importModal}
      paperClass={styles.modalPaper}
      onBackdropClick={() => null}
      primaryBtnText={btnTitle}
      onPrimaryClick={handleUploadFile}
      note={data.length > 0 && (note || '')}
      title={title}
    >
      <div className={styles.modalBody}>
        {data.length === 0 ? (
          <Box padding="16px" alignSelf="center">
            <CSVReader
              noDrag
              addRemoveButton
              accept="text/csv, .csv"
              style={{ margin: '16px !important', padding: 0 }}
              onDrop={handleOnDrop}
              config={{
                preview: 10
              }}
            >
              <IconsUploadCSV
                title={iconTitle}
                subtitle={iconSubtitle?.replace('#', `${maxAllowedRows}`)}
              />
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
                                  {field.name}{field.required ? '*' : ''}
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
        {isLoading && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar' />
          </div>
        )}
        <Snackbar open={snackbar.show} autoHideDuration={4000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="error">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </EASModal>
  );
};

export default CSVImportModal;

CSVImportModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  importBtnTitle: PropTypes.string,
  note: PropTypes.string,
  iconTitle: PropTypes.string,
  iconSubtitle: PropTypes.string,
  isLoading: PropTypes.bool,
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
