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

  handleClick = () => {
    fb(FB => FB.CustomerChat.show(true));
  };

  render() {
    return (
      <div
        className='fb-customerchat'
        attribution='setup_tool'
        page_id='108785330910403'
        onClick={this.handleClick}
        // theme_color="..."
        // logged_in_greeting="..."
        // logged_out_greeting="..."
        // greeting_dialog_display="..."
        // greeting_dialog_delay="..."
        // minimized="false"
        // ref="..."
      />
    );
  }
}

export default CustomerChat;
