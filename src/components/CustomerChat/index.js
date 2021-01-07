import React from 'react';

import { fb } from '../../utils/facebookChat';
import './styles.scss';

class CustomerChat extends React.PureComponent {
  componentDidMount() {
    this.timeout = setTimeout(() => {
      fb(FB => this.timeout && FB.XFBML.parse());
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    delete this.timeout;
  }

  render() {
    return (
      <div
        className='fb-customerchat'
        attribution='setup_tool'
        page_id='108785330910403'
        theme_color='#3A83DC'
        logged_in_greeting='Salut, cu ce te putem ajuta?'
        logged_out_greeting='Salut, cu ce te putem ajuta?'
      />
    );
  }
}

export default CustomerChat;
