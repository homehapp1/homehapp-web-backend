import React from 'react';
import BaseWidget from './BaseWidget';
import linearPartition from 'linear-partition';
import DOMManipulator from '../../DOMManipulator';
import Modal from './Modal';
import Pager from './Pager';
import Image from './Image';

let debug = require('../../../common/debugger')('Gallery');

export default class Gallery extends BaseWidget {
  static propTypes = {
    images: React.PropTypes.array.isRequired,
    title: React.PropTypes.string,
    columns: React.PropTypes.number,
    imageWidth: React.PropTypes.number,
    fullscreen: React.PropTypes.bool,
    className: React.PropTypes.string
  };

  static defaultProps = {
    images: [],
    title: '',
    columns: 8,
    imageWidth: 200,
    fullscreen: true,
    className: null
  };

  static validate(props) {
    if (!props.images) {
      debug('No images provided for the gallery');
      throw new Error('Attribute "images" is missing');
    }

    if (!Array.isArray(props.images)) {
      debug('Attribute "images" is not an array');
      throw new Error('Attribute "images" is not an array');
    }

    props.images.map((image) => {
      Image.validate(image);
    });
  }

  constructor() {
    super();
    this.aspectRatios = [];
    this.galleryImages = [];
    this.preloaded = {};

    // Bind to this
    this.onResize = this.onResize.bind(this);
    this.onClick = this.onClick.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.moveStart = this.moveStart.bind(this);
    this.moveEvent = this.moveEvent.bind(this);
    this.moveEnd = this.moveEnd.bind(this);

    this.imageContainer = null;

    this.startT = null;
    this.startX = null;
    this.currentX = null;
    this.currentX = null;
    this.currentImage = null;
    this.moveImages = [];

    this.events = [
      {
        events: ['mousedown', 'touchstart'],
        handler: this.moveStart,
        target: 'image'
      },
      {
        events: ['mousemove', 'touchmove'],
        handler: this.moveEvent,
        target: 'document'
      },
      {
        events: ['mouseleave', 'mouseout', 'mouseup', 'touchend', 'touchcancel'],
        handler: this.moveEnd,
        target: 'document'
      }
    ];
  }

  componentDidMount() {
    if (!this.refs.gallery) {
      return null;
    }

    this.gallery = new DOMManipulator(this.refs.gallery);

    this.images = this.gallery.node.getElementsByTagName('img');

    for (let i = 0; i < this.images.length; i++) {
      this.galleryImages.push(this.images[i].parentNode.href);
    }

    this.updateGallery();

    window.addEventListener('resize', this.onResize);

    this.gallery.addEvent('click', this.onClick, true);
    this.gallery.addEvent('touch', this.onClick, true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    this.endCapture();

    this.gallery.removeEvent('click', this.onClick, true);
    this.gallery.removeEvent('touch', this.onClick, true);
  }

  // Start moving, capture the event
  startCapture() {
    // Unbind all the old events in case of an unsuccessful unbinding
    this.endCapture();
    // Bind a whole lot of events here
    for (let i = 0; i < this.events.length; i++) {
      for (let n = 0; n < this.events[i].events.length; n++) {
        let target = document;
        let capturing = false;
        if (this.events[i].target === 'image') {
          target = this.imageContainer;
          capturing = true;
        }

        if (!target) {
          continue;
        }

        target.addEventListener(this.events[i].events[n], this.events[i].handler, capturing);
      }
    }
  }

  endCapture() {
    // Unbind a whole lot of events here
    for (let i = 0; i < this.events.length; i++) {
      for (let n = 0; n < this.events[i].events.length; n++) {
        let target = document;
        let capturing = false;
        if (this.events[i].target === 'image') {
          target = this.imageContainer;
          capturing = true;
        }

        if (!target) {
          continue;
        }

        target.removeEventListener(this.events[i].events[n], this.events[i].handler, capturing);
      }
    }
  }

  getX(event) {
    if (typeof event.clientX !== 'undefined') {
      return event.clientX;
    }

    if (typeof event.touches !== 'undefined' && event.touches.length === 1) {
      return event.touches[0].clientX;
    }

    return null;
  }

  moveStart(event) {
    event.stopPropagation();
    event.preventDefault();

    this.startX = this.getX(event);
    this.currentX = this.startX;

    if (this.startX === null) {
      return false;
    }

    this.startT = (new Date()).getTime();
    this.moveImages = [];

    let images = this.imageContainer.getElementsByTagName('img');

    for (let i = 0; i < images.length; i++) {
      if (Math.abs(Number(images[i].getAttribute('data-distance'))) <= 1) {
        this.moveImages.push(images[i]);
        images[i].setAttribute('data-move', '');
      }
    }

    return false;
  }

  moveEvent(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.startX === null) {
      return true;
    }

    let dx = this.getX(event) - this.startX;

    for (let i = 0; i < this.moveImages.length; i++) {
      let d = Number(this.moveImages[i].getAttribute('data-distance'));
      let margin = dx - d * window.innerWidth;
      this.moveImages[i].style.marginLeft = `${margin}px`;
    }

    this.currentX = this.getX(event);

    return false;
  }

  moveEnd(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.startX === null) {
      return true;
    }

    let currentT = (new Date()).getTime();
    let dx = this.startX - this.currentX;
    let absX = Math.abs(dx);
    let dt = currentT - this.startT;
    let speed = absX / dt;

    // Reset for the next round
    this.startX = null;
    for (let i = 0; i < this.moveImages.length; i++) {
      this.moveImages[i].removeAttribute('data-move');
      this.moveImages[i].style.marginLeft = null;
    }

    if (absX < 10 && dt < 500) {
      return true;
    }


    if ((absX > window.innerWidth * 0.1 && speed > 1) || absX > window.innerWidth * 0.25) {
      if (dx < 0) {
        this.changeImage(-1);
      } else {
        this.changeImage(1);
      }
    }

    return false;
  }

  // Update the sizes and positions in the gallery
  onResize() {
    this.updateGallery();
  }

  onClick(e) {
    let target = e.srcElement;

    // Get the link if clicked on a child
    while (target && target.tagName.toLowerCase() !== 'a') {
      target = target.parentNode;

      // No parent, no link, end gracefully
      if (!target || target.tagName.toLowerCase() === 'body') {
        return true;
      }
    }

    this.modal = this.createModal();
    this.modalContainer = null;
    this.preloaded = {};

    // Reference to self
    let app = this;

    React.render(this.modal, document.getElementById('modals'), function() {
      try {
        let src = target.getAttribute('href');
        app.currentImage = src;
        app.modalContainer = this.refs.modal.getDOMNode();
        app.imageContainer = document.getElementById('galleryImages');
        app.createImage(src);
        app.preloadSurroundingImages(src);
        app.startCapture();
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
      <Modal onclose={this.closeModal}>
        <Pager onchange={this.changeImage} onclose={this.closeModal} />
        <div id='galleryImages'></div>
      </Modal>
    );
  }

  closeModal() {
    this.endCapture();
    this.preloaded = {};
  }

  // Calculate the distance to the source element
  getDistance(src) {
    let current = this.galleryImages.indexOf(this.currentImage);
    let target = this.galleryImages.indexOf(src);
    let d = current - target;
    let tolerance = Math.min(this.galleryImages.length - 2, 2);
    let max = this.galleryImages.length - tolerance;

    // Left overflow, start from the last one on right
    if (d === max) {
      d = -1 * tolerance;
    }

    // Right overflow, start from the first one on left
    if (d === -1 * max) {
      d = tolerance;
    }

    return d;
  }

  changeImage(dir) {
    let next = this.galleryImages.indexOf(this.currentImage) + dir;

    if (next < 0) {
      next = 0;
      // next = this.galleryImages.length - 1;
    }
    if (next >= this.galleryImages.length) {
      next = this.galleryImages.length - 1;
      // next = 0;
    }

    this.currentImage = this.galleryImages[next];
    this.preloadSurroundingImages(this.currentImage);
    this.updateDistances();
  }

  updateDistances() {
    let images = this.imageContainer.getElementsByTagName('img');

    for (let i = 0; i < images.length; i++) {
      images[i].setAttribute('data-distance', this.getDistance(images[i].src));
    }
  }

  preloadSurroundingImages() {
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

    for (let img in this.imageContainer.getElementsByTagName('img')) {
      if (img.src === src) {
        image = img;
        break;
      }
    }

    if (typeof this.preloaded[src] === 'undefined') {
      image.setAttribute('data-distance', distance);
      image.onload = function() {
        app.preloaded[this.src] = this;
      };
      image.src = src;
      image.className = 'gallery-image';
      if (!image.parentNode) {
        this.imageContainer.appendChild(image);
      }
    }
  }

  // Update the gallery view by setting the width and height as linear
  // partition suggests
  updateGallery() {
    let width = this.gallery.width();
    let columns = 4;
    if (width < 900) {
      columns = 3;
    }

    let rows = Math.ceil(this.images.length / columns);
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

  renderWidget() {
    let classes = ['gallery', 'widget', 'clearfix'];
    let subclasses = ['gallery-images'];
    if (this.props.className) {
      classes.push(this.props.className);
    }
    // if (this.props.images.length < 4) {
    //   subclasses.push('width-wrapper');
    // }
    let title = null;
    if (this.props.title) {
      title = (
        <div className='center'>
          <h2>{this.props.title}</h2>
        </div>
      );
    }
    return (
      <div className={classes.join(' ')}>
        {title}
        <div className={subclasses.join(' ')} ref='gallery'>
        {
          this.props.images.map((item, index) => {
            let image = {
              src: item.url,
              alt: item.alt || '',
              variant: 'gallery',
              linked: (this.props.fullscreen) ? 'fullscreen' : null,
              aspectRatio: item.aspectRatio || (item.width / item.height)
            };

            return (
              <Image {...image} key={index} />
            );
          })
        }
        </div>
      </div>
    );
  }
}
