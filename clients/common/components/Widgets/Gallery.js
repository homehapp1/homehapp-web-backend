'use strict';

import React from 'react';
import linearPartition from 'linear-partition';
import DOMManipulator from '../../DOMManipulator';
import Modal from './Modal';
import Pager from './Pager';
import Image from './Image';

class Gallery extends React.Component {
  static propTypes = {
    images: React.PropTypes.array.isRequired,
    title: React.PropTypes.string,
    columns: React.PropTypes.number,
    imagewidth: React.PropTypes.number,
    links: React.PropTypes.bool
  }

  constructor() {
    super();
    this.aspectRatios = [];
    this.columns = null;
    this.imageWidth = null;
    this.galleryImages = [];
    this.preloaded = {};

    // Bind to this
    this.onResize = this.onResize.bind(this);
    this.onClick = this.onClick.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.currentImage = null;
  }

  componentDidMount() {
    if (!this.refs.gallery) {
      return null;
    }

    this.gallery = new DOMManipulator(this.refs.gallery);
    if (!this.imageWidth) {
      this.imageWidth = this.props.imagewidth || 500;
    }

    if (!this.columns) {
      this.columns = this.props.columns || 10;
    }

    this.images = this.gallery.node.getElementsByTagName('img');

    for (let i = 0; i < this.images.length; i++) {
      this.galleryImages.push(this.images[i].parentNode.href);
    }

    this.updateGallery();

    window.addEventListener('resize', this.onResize);
    this.gallery.addEvent('click', this.onClick);
    this.gallery.addEvent('touch', this.onClick);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  static INIT = 0;
  static LOADING = 1;
  static READY = 2;

  // Update the sizes and positions in the gallery
  onResize() {
    this.updateGallery();
  }

  onClick(e) {
    let target = e.srcElement;

    // Get the link if clicked on a child
    while (target.tagName.toLowerCase() !== 'a') {
      target = target.parentNode;

      // No parent, no link, end gracefully
      if (!target || target.tagName.toLowerCase() === 'body') {
        return true;
      }
    }

    this.modal = this.createModal();
    this.modalContainer = null;

    // Reference to self
    let app = this;

    React.render(this.modal, document.getElementById('modals'), function() {
      try {
        let src = target.getAttribute('href');
        app.currentImage = src;
        app.modalContainer = this.refs.modal.getDOMNode();
        app.createImage(src);
        app.preloadSurroundingImages(src);
      } catch (err) {
        console.error(err.message);
      }
    });

    e.preventDefault();
    return false;
  }

  // Create the modal view
  createModal() {
    return (
      <Modal>
        <div id='galleryImages'>
          <Pager onchange={this.changeImage} onclose={this.closeModal} />
        </div>
      </Modal>
    );
  }

  closeModal() {
    this.modalContainer.click();
    this.preloaded = {};
  }

  // Calculate the distance to the source element
  getDistance(src) {
    let current = this.galleryImages.indexOf(this.currentImage);
    let target = this.galleryImages.indexOf(src);
    let d = current - target;
    let max = this.galleryImages.length - 1;

    // Left overflow, start from the last one on right
    if (d === max) {
      d = -1;
    }

    // Right overflow, start from the first one on left
    if (d === -1 * max) {
      d = 1;
    }

    return d;
  }

  changeImage(dir) {
    let next = this.galleryImages.indexOf(this.currentImage) + dir;

    if (next < 0) {
      next = this.galleryImages.length - 1;
    }
    if (next >= this.galleryImages.length) {
      next = 0;
    }

    this.currentImage = this.galleryImages[next];
    this.preloadSurroundingImages(this.currentImage);
    this.updateDistances();
  }

  updateDistances() {
    let images = document.getElementById('galleryImages').getElementsByTagName('img');

    for (let i = 0; i < images.length; i++) {
      images[i].setAttribute('data-distance', this.getDistance(images[i].src));
    }
  }

  preloadSurroundingImages(src) {
    let current = this.galleryImages.indexOf(this.currentImage);
    let next = current + 1;
    let prev = current - 1;

    if (prev < 0) {
      prev = this.galleryImages.length - 1;
    }

    if (next >= this.galleryImages.length) {
      next = 0;
    }

    this.createImage(this.galleryImages[prev]);
    this.createImage(this.galleryImages[next]);
  }

  // Create the displayed Image
  createImage(src) {
    let distance = this.getDistance(src);
    let image = document.createElement('img');
    let app = this;

    if (typeof this.preloaded[src] === 'undefined') {
      image.setAttribute('data-distance', distance);
      image.onload = function() {
        app.preloaded[this.src] = this;
      };
      image.src = src;
      image.className = 'gallery-image';

      document.getElementById('galleryImages').appendChild(image);
    }
  }

  // Update the gallery view by setting the width and height as linear
  // partition suggests
  updateGallery() {
    let columns = Math.min(Math.round(this.gallery.width() / this.imageWidth), this.columns);

    let rows = Math.ceil(this.images.length / columns);
    let width = this.gallery.width();
    let aspectRatios = [];

    for (let i = 0; i < this.images.length; i++) {
      aspectRatios.push(Number(this.images[i].getAttribute('data-aspect-ratio')));
    }

    let partitioned = linearPartition(aspectRatios, rows);
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

        let image = new DOMManipulator(this.images[index]);
        image.addClass('visible');

        if (!j) {
          image.addClass('first');
          // One height per row to prevent rounding corner cases
          h = Math.round(col / total * width / aspectRatios[index]);
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

  render() {
    this.loadState = Gallery.INIT;
    return (
      <div className='gallery item full-height' ref='gallery'>
        {
          this.props.images.map((image, index) => {
            if (this.props.links === false) {
              return (
                <Image src={image.url} alt={image.alt} variant='medium' key={index} aspectRatio={image.aspectRatio} />
              );
            }

            return (
              <Image src={image.url} alt={image.alt} variant='medium' linked='large' key={index} aspectRatio={image.aspectRatio} />
            );
          })
        }
      </div>
    );
  }
}

export default Gallery;
