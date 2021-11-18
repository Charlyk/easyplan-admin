import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import styles from "./TreatedPatientsChart.module.scss";

const TreatedPatients = () => {
  return (
    <Grid item xs={4} className={styles.treatedPatientsChart}>
      <div className="chartItem">
        <Typography className="chartTitle">Pacienti cu plan de tratament</Typography>
        <div className={styles.patientsCountContainer}>
          <Typography className={styles.counterLabel}>70%</Typography>
        </div>
      </div>
    </Grid>
  )
}

export default TreatedPatients;
