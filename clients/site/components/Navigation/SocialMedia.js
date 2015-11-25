import React from 'react';

export default class SocialMedia extends React.Component {
  static propTypes = {
    className: React.PropTypes.string
  }

  static defaultProps = {
    className: null
  }

  render() {
    let classes = ['social'];
    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <ul className={classes.join(' ')}>
        <li>
          <a href='https://www.facebook.com/homehapp' target='_blank'>
            <i className='fa fa-facebook-square'>
              <span className='alt'>Facebook</span>
            </i>
          </a>
        </li>
        <li>
          <a href='https://www.twitter.com/homehapp' target='_blank'>
            <i className='fa fa-twitter'>
              <span className='alt'>Twitter</span>
            </i>
          </a>
        </li>
        <li>
          <a href='https://www.instagram.com/homehapp' target='_blank'>
            <i className='fa fa-instagram'>
              <span className='alt'>Instagram</span>
            </i>
          </a>
        </li>
      </ul>
    );
  }
}

// <li>
//   <a href='https://www.pinterest.com' target='_blank'>
//     <i className='fa fa-pinterest'></i>
//   </a>
// </li>
// <li>
//   <a href='https://www.youtube.com' target='_blank'>
//     <i className='fa fa-youtube-square'></i>
//   </a>
// </li>
