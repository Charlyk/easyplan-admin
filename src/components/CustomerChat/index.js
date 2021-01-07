import React from 'react';
import './styles.scss';

class CustomerChat extends React.PureComponent {
  componentDidMount() {
    setTimeout(() => {
      window.FB.XFBML.parse();
      console.log(window.FB);
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
