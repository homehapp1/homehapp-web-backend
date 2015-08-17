'use strict';

import React from 'react';
import linearPartition from 'linear-partition';
import DOMManipulator from '../../DOMManipulator';

class Gallery extends React.Component {
  static propTypes = {
    children: React.PropTypes.array.isRequired
  }

  static INIT = 0;
  static LOADING = 1;
  static READY = 2;

  constructor() {
    super();
    this.preloadStack = {};
    this.aspectRatios = [];

    this.onResize = this.onResize.bind(this);
  }

  onResize() {
    this.updateGallery();
  }

  preloadImage(src, index) {
    if (typeof this.preloadStack[src] !== 'undefined') {
      return null;
    }

    this.loadState = Gallery.LOADING;
    this.preloadStack[src] = null;
    let app = this;

    let image = new Image();
    image.index = index;
    image.onload = function() {
      app.preloadStack[this.src] = this.width / this.height;
      app.aspectRatios[this.index] = this.width / this.height;
      app.updateGallery();
    };
    image.src = src;
  }

  updateGallery() {
    let images = this.refs.gallery.getDOMNode().getElementsByTagName('img');
    let rows = Math.ceil(images.length / 4);
    let height = 300;
    let width = this.gallery.width();

    switch (this.loadState) {
      case Gallery.READY:
        let partitioned = linearPartition(this.aspectRatios, rows);
        let index = 0;

        for (let i = 0; i < partitioned.length; i++) {
          let row = partitioned[i];
          let total = 0;
          for (let j = 0; j < row.length; j++) {
            total += row[j];
          }

          for (let j = 0; j < row.length; j++) {
            let col = row[j];
            let w = col / total * 100;

            let image = new DOMManipulator(images[index]);
            image.addClass('visible');

            if (!j) {
              image.addClass('first');
            }

            image.css({
              width: `${w}%`
            });
            index++;
          }
        }
        break;

      case Gallery.INIT:
        for (let i = 0; i < images.length; i++) {
          this.preloadImage(images[i].src, i);
        }
        return null;

      case Gallery.LOADING:
        for (let k in this.preloadStack) {
          if (!this.preloadStack[k]) {
            return null;
          }
        }
        this.loadState = Gallery.READY;
        this.updateGallery();
        break;
    }
  }

  componentDidMount() {
    this.gallery = new DOMManipulator(this.refs.gallery);
    this.updateGallery();

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    this.loadState = Gallery.INIT;
    return (
      <div className='gallery item full-height' ref='gallery'>
        {this.props.children}
      </div>
    );
  }
}

export default Gallery;
