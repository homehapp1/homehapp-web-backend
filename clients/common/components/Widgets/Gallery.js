'use strict';

import React from 'react';
import ApplicationStore from '../../stores/ApplicationStore';
import linearPartition from 'linear-partition';
import DOMManipulator from '../../DOMManipulator';
import Modal from './Modal';
import Pager from './Pager';

class Gallery extends React.Component {
  static propTypes = {
    items: React.PropTypes.array,
    columns: React.PropTypes.number,
    imagewidth: React.PropTypes.number,
    links: React.PropTypes.bool
  }

  constructor() {
    super();
    this.preloadStack = {};
    this.aspectRatios = [];
    this.columns = null;
    this.imageWidth = null;
    this.galleryImages = [];
    this.preloaded = [];

    // Bind to this
    this.onResize = this.onResize.bind(this);
    this.onClick = this.onClick.bind(this);
    this.storeListener = this.onStateChange.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.currentImage = null;
  }

  componentDidMount() {
    ApplicationStore.listen(this.storeListener);

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

    this.updateGallery();

    window.addEventListener('resize', this.onResize);
    this.gallery.addEvent('click', this.onClick);
    this.gallery.addEvent('touch', this.onClick);
  }

  componentWillUnmount() {
    ApplicationStore.unlisten(this.storeListener);
    window.removeEventListener('resize', this.onResize);
  }

  state = {
    config: ApplicationStore.getState().config
  }

  onStateChange(state) {
    this.setState({
      config: ApplicationStore.getState().config
    });
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
        app.modalContainer = this.refs.modal.getDOMNode();
        app.createImage(target.getAttribute('href'));
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
  }

  createImage(src, d = null) {
    // Preload the surrounding images
    this.preloadSurrounding(src);
    this.currentImage = src;

    // These do not require any server-side rendering and thus the liberty
    // of direct DOM manipulation has been used in favor of loading only
    // the images that are needed
    let img = document.createElement('img');
    img.src = src;
    img.className = 'gallery-image';

    if (d) {
      img.setAttribute('data-away', d);
    }

    document.getElementById('galleryImages').appendChild(img);
    this.currentImage = src;
    return img;
  }

  preloadSurrounding(src) {
    let index = this.galleryImages.indexOf(src);
    let prev = index - 1;
    let next = index + 1;

    if (typeof this.galleryImages[prev] !== 'undefined') {
      let imgPrev = new Image();
      imgPrev.src = this.galleryImages[prev];
      this.preloaded.push(this.galleryImages[prev]);
    }

    if (typeof this.galleryImages[next] !== 'undefined') {
      let imgNext = new Image();
      imgNext.src = this.galleryImages[next];
      this.preloaded.push(this.galleryImages[next]);
    }
  }

  // Change the image, direction as integer
  changeImage(dir) {
    let images = this.modalContainer.getElementsByTagName('img');
    let current = this.galleryImages.indexOf(this.currentImage);
    let next = current + dir;
    let d = (dir === 1) ? 'next' : 'prev';

    if (next < 0) {
      next = this.galleryImages.length - 1;
      d = 'next';
    }
    if (next >= this.galleryImages.length) {
      next = 0;
      d = 'prev';
    }
    let found = false;

    for (let i = 0; i < images.length; i++) {
      let src = images[i].src;
      let io = this.galleryImages.indexOf(src);

      if (io < next) {
        images[i].setAttribute('data-away', 'prev');
      }

      if (io === next) {
        images[i].removeAttribute('data-away');
        found = true;
      }

      if (io > next) {
        images[i].setAttribute('data-away', 'next');
      }
    }

    this.currentImage = this.galleryImages[next];

    // Create the big images one by one if needed
    if (!found) {
      let img = this.createImage(this.currentImage, d);

      window.setTimeout(function() {
        img.removeAttribute('data-away');
      }, 50);
    }
  }

  // Preload an image and store its aspect ratio for the gallery
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
    if (!this.state.config) {
      return null;
    }

    this.loadState = Gallery.INIT;
    return (
      <div className='gallery item full-height' ref='gallery'>
        {
          this.props.items.map((src, index) => {
            let images = {
              // small: `${this.state.config.cloudinary.baseUrl}${this.state.config.cloudinary.transformations.small}/${this.props.src}`,
              medium: `${this.state.config.cloudinary.baseUrl}${this.state.config.cloudinary.transformations.medium}/${src}`,
              large: `${this.state.config.cloudinary.baseUrl}${this.state.config.cloudinary.transformations.large}/${src}`
            };

            if (this.props.links === false) {
              return (
                <img src={images.medium} key={index} />
              );
            }

            this.galleryImages.push(images.large);

            return (
              <a href={images.large} key={index}><img src={images.medium} /></a>
            );
          })
        }
      </div>
    );
  }
}

export default Gallery;
