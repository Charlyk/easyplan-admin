import React from "react";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import styles from "./DoctorsIncomeChart.module.scss";
import Typography from "@material-ui/core/Typography";
import { PolarArea } from "react-chartjs-2";
import { getDoctorIncomeChartData, rightLegendOptions } from "../ClinicAnalytics.utils";
import { textForKey } from "../../../../../utils/localization";

const DoctorsIncomeChart = () => {
  return (
    <Grid item xs={3} className={styles.doctorsIncomeChart}>
      <div className={clsx(styles.incomeChartWrapper, 'chartItem')}>
        <Typography className="chartTitle">
          {textForKey('analytics_doctor_income')}
        </Typography>
        <PolarArea
          type="polarArea"
          data={getDoctorIncomeChartData()}
          height={120}
          options={rightLegendOptions}
        />
      </div>
    </Grid>
  )
};

export default DoctorsIncomeChart;
