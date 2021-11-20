import React from "react";
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { textForKey } from "../../../../../utils/localization";
import formattedNumber from "../../../../../utils/formattedNumber";
import styles from "./TreatedPatientsChart.module.scss";

const TreatedPatients = ({ patients }) => {
  return (
    <Grid item xs={4} className={styles.treatedPatientsChart}>
      <div className="chartItem">
        <Typography className="chartTitle">
          {textForKey('analytics_treated_patients')}
        </Typography>
        <div className={styles.patientsCountContainer}>
          <Typography className={styles.counterLabel}>{formattedNumber(patients)}%</Typography>
        </div>
      </div>
    </Grid>
  )
}

export default TreatedPatients;

TreatedPatients.propTypes = {
  patients: PropTypes.number
}
