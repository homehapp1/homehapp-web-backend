'use strict';

import React from 'react';
import linearPartition from 'linear-partition';
import DOMManipulator from '../../DOMManipulator';

class Gallery extends React.Component {
  static propTypes = {
    children: React.PropTypes.array.isRequired,
    columns: React.PropTypes.number,
    imagewidth: React.PropTypes.number
  }

  constructor() {
    super();
    this.preloadStack = {};
    this.aspectRatios = [];
    this.columns = null;
    this.imageWidth = null;

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.gallery = new DOMManipulator(this.refs.gallery);
    if (!this.imageWidth) {
      this.imageWidth = this.props.imagewidth || 500;
    }

    if (!this.columns) {
      this.columns = this.props.columns || 10;
    }

    this.updateGallery();

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }


  static INIT = 0;
  static LOADING = 1;
  static READY = 2;

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

  // Partition the gallery based on the divisions provided by
  // linear partition algorithm
  partition(images) {
    let columns = Math.min(Math.round(this.gallery.width() / this.imageWidth), this.columns);

    let rows = Math.ceil(images.length / columns);
    let width = this.gallery.width();

    let partitioned = linearPartition(this.aspectRatios, rows);
    let index = 0;

    for (let i = 0; i < partitioned.length; i++) {
      let row = partitioned[i];
      let total = 0;
      let h = 0;

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
          // One height per row to prevent rounding corner cases
          h = Math.round(col / total * width / this.aspectRatios[index]);
        }

        // Relative width to fill the space fully, absolute height
        // to snap everything in place horizontally
        image.css({
          width: `${w}%`,
          height: `${h}px`
        });
        index++;
      }
    }
  }

  updateGallery() {
    let images = this.refs.gallery.getDOMNode().getElementsByTagName('img');
    switch (this.loadState) {
      case Gallery.READY:
        this.partition(images);
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
