import React from 'react';
import { merge } from '../../Helpers';

// let debug = require('debug')('TimeAgo');

export default class TimeAgo extends React.Component {
  static propTypes = {
    date: React.PropTypes.string.isRequired,
    live: React.PropTypes.bool,
    tag: React.PropTypes.string,
    formatter: React.PropTypes.func
  }

  static defaultProps = {
    live: true,
    tag: 'span',
    formatter: function(value, unit, suffix) {
      if (value > 1) {
        unit += 's';
      }
      let finalSuffix = `${unit} ${suffix}`;
      return `${value} ${finalSuffix}`;
    }
  }

  constructor(props) {
    super(props);
    this.mounted = false;
  }

  componentDidMount() {
    if (this.props.live) {
      this._tick(true);
    }
  }

  _tick(refresh) {
    if (!this.mounted) {
      return;
    }
    let timeout = 1000;
    let now = Date.now();

    let then = (new Date(this.props.date)).valueOf();
    let seconds = Math.round(Math.abs(now - then) / 1000);

    if (seconds < 60) {
      timeout = 1000;
    } else if (seconds < (60 * 60)) {
      timeout = 1000 * 60;
    } else if (seconds < (60 * 60 * 24)) {
      timeout = 1000 * 60 * 60;
    } else {
      timeout = 0;
    }

    if (timeout > 0) {
      setTimeout(this._tick, timeout);
    }

    if (!refresh) {
      this.forceUpdate();
    }
  }

  render() {
    let now = Date.now();
    let then = (new Date(this.props.date)).valueOf();
    let seconds = Math.round(Math.abs(now - then) / 1000);

    let suffix = then < now ? 'ago' : 'from now';
    let value = null, unit = null;

    if (seconds < 60) {
      value = Math.round(seconds);
      unit = 'second';
    } else if (seconds < (60 * 60)) {
      value = Math.round(seconds / 60);
      unit = 'minute';
    } else if (seconds < (60 * 60 * 24)) {
      value = Math.round(seconds / (60 * 60));
      unit = 'hour';
    } else if (seconds < (60 * 60 * 24 * 7)) {
      value = Math.round(seconds / (60 * 60 * 24));
      unit = 'day';
    } else if (seconds < (60 * 60 * 24 * 30)) {
      value = Math.round(seconds / (60 * 60 * 24 * 7));
      unit = 'week';
    } else if (seconds < (60 * 60 * 24 * 365)) {
      value = Math.round(seconds / (60 * 60 * 24 * 30));
      unit = 'month';
    } else {
      value = Math.round(seconds / (60 * 60 * 24 * 365));
      unit = 'year';
    }

    let props = merge({}, this.props);
    // props.title = props.date.toISOString();
    delete props.date;
    delete props.formatter;
    delete props.tag;
    // debug('Props', props);

    this.mounted = true;

    return React.createElement(
      this.props.tag, props, this.props.formatter(value, unit, suffix)
    );
  }
}
