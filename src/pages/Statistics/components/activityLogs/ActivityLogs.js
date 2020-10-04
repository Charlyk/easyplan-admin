import React from 'react';

import { textForKey } from '../../../../utils/localization';

const ActivityLogs = props => {
  return (
    <div className='activity-logs'>
      <table className='data-table'>
        <thead>
          <tr>
            <td className='date-cell'>{textForKey('Date')}</td>
            <td className='user-cell'>{textForKey('User')}</td>
            <td className='details-cell'>{textForKey('Details')}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='date-cell'>12/05/19 14:30</td>
            <td className='user-cell'>Dianne Russell</td>
            <td className='details-cell'>
              Modificat metodă tratament de la Implant la Bracket pacient: Igor
              vieru
            </td>
          </tr>
          <tr>
            <td className='date-cell'>12/05/19 14:30</td>
            <td className='user-cell'>Dianne Russell</td>
            <td className='details-cell'>
              Modificat metodă tratament de la Implant la Bracket pacient: Igor
              vieru
            </td>
          </tr>
          <tr>
            <td className='date-cell'>12/05/19 14:30</td>
            <td className='user-cell'>Dianne Russell</td>
            <td className='details-cell'>
              Modificat metodă tratament de la Implant la Bracket pacient: Igor
              vieru
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLogs;
