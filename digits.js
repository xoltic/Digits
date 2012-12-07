
// Basic JS Operations
var JS = {
  createElement: function (params) {
    var el = document.createElement(params.type),
      i;

    if (params.classes) {
      for (i = 0; i < params.classes.length; i += 1) {
        el.classList.add(params.classes[i]);
      }
    }

    if (params.styles) {
      for (i = 0; i < params.styles.length; i += 1) {
        el.style[params.styles[i][0]] = params.styles[i][1];
      }
    }

    if (params.parent) {
      params.parent.appendChild(el);
    }

    return el;
  },

  class: function (params) {
    var els = params.parent.querySelectorAll(params.selector),
      e;

    for (e = 0; e < els.length; e += 1) {
      if (params.mode === 'remove') {
        els[e].classList.remove(params.className);
      } else if (params.mode === 'add') {
        els[e].classList.add(params.className);
      }
    }
  }
};


// Individual Digit
var Digit = function (params) {
  var current,
    topHalfWrapper,
    bottomHalfWrapper,
    digitWrapper,
    ripple,
    interval;

  function createDigit(no) {
    var topHalf,
      bottomHalf;

    topHalf = JS.createElement({
      parent: topHalfWrapper,
      type: 'div',
      classes: ['no-' + no, 'top-half'],
      styles: [
        ['webkitTransition', 'all ' + params.animationDelay + ' linear'],
        ['MozTransition', 'all ' + params.animationDelay + ' linear']
      ]
    });

    bottomHalf = JS.createElement({
      parent: bottomHalfWrapper,
      type: 'div',
      classes: ['no-' + no, 'bottom-half'],
      styles: [
        ['zIndex', 10 - no],
        ['webkitTransition', 'all ' + params.animationDelay + ' linear'],
        ['webkitTransitionDelay', params.animationDelay],
        ['MozTransition', 'all ' + params.animationDelay + ' linear'],
        ['MozTransitionDelay', params.animationDelay]
      ]
    });

    bottomHalf.innerHTML = no;
    topHalf.innerHTML = no;

    if (no === params.start) {
      topHalf.classList.add('show');
      bottomHalf.classList.add('show');
    }
  }

  function getMax() {
    var max;

    if (params.group && ripple) {
      max =  ripple.isMax() ? params.max : 9;
    } else {
      max = params.max;
    }

    return max;
  }

  function cleanFrame(f, type) {
    if (f > getMax()) {
      f = 0;
    }

    JS.class({ parent: digitWrapper, selector: type + '.no-' + f, className: 'no-animation', mode: 'add' });
    JS.class({ parent: digitWrapper, selector: type + '.no-' + f, className: 'show', mode: 'remove' });
    JS.class({ parent: digitWrapper, selector: type + '.no-' + f, className: 'roll-over', mode: 'remove' });
  }

  function bottomHalfZeroZindex(i) {
    if (i === 0) {
      digitWrapper.querySelector('.bottom-half.no-' + getMax()).style.zIndex = 999;
    }
  }

  function tickTock() {
    if (current === 0) {
      digitWrapper.querySelector('.bottom-half.no-' + getMax()).style.zIndex = 1;
    }

    // Reset Top Half
    setTimeout(function () {
      cleanFrame(current + 1, '.top-half');
    }, parseFloat(params.animationDelay) * 1000);

    // Reset bottom half
    setTimeout(function () {
      cleanFrame(current + 1, '.bottom-half');
      bottomHalfZeroZindex(current);
    }, parseFloat(params.animationDelay) * 1000 * 2);

    // Prepare for next animation
    setTimeout(function () {
      JS.class({ parent: digitWrapper, selector: '.top-half', className: 'no-animation', mode: 'remove' });
      JS.class({ parent: digitWrapper, selector:'.bottom-half', className: 'no-animation', mode: 'remove' });
    }, parseFloat(params.animationDelay) * 1000 * 3);

    // Animate top half
    JS.class({ parent: digitWrapper, selector: '.top-half.no-' + current, className: 'roll-over', mode: 'add' });

    // Affect nearby digits
    if (ripple && current === 0) {
      ripple.flip();
    }

    // Next cycle
    current = current === 0 ? getMax() : --current;

    // Finish animation
    JS.class({ parent: digitWrapper, selector: '.no-' + current, className: 'show', mode: 'add' });

    // Stop Timer
    if (params.play && ripple && current === 0) {

      if (ripple.isReady()) {
        params.ready();
        clearInterval(interval);
      }
    }
  }

  function build() {
    var d;

    if (params) {
      params.max = params.max || 9;
      params.delay = params.delay || 1000;
      params.first = params.first || false;
      params.start = params.start >= 0 ? params.start : params.max;
      params.group = params.group || false;
      params.play = params.play || false;
      params.animationDelay = params.animationDelay || '.20s';
      params.name = params.name  || [];
      params.offset = params.offset || 0;

      params.name.push('digit');
      current = params.start;

    } else {
      throw new Error('Params not Defined');
    }

    digitWrapper = JS.createElement({ type: 'div', classes: params.name });
    topHalfWrapper = JS.createElement({ parent: digitWrapper, type: 'div', classes: ['top-half-wrapper'] });
    bottomHalfWrapper = JS.createElement({ parent: digitWrapper, type: 'div', classes: ['bottom-half-wrapper'] });

    for (d = 0; d <= 9; d += 1) {
      createDigit(d);
    }

    if (params.first && params.wrapper.childNodes[0]) {
      params.wrapper.insertBefore(digitWrapper, params.wrapper.childNodes[0]);
    } else {
      params.wrapper.appendChild(digitWrapper);
    }

    bottomHalfZeroZindex(params.start);
  }

  this.isMax = function () {
    return current === params.max;
  }

  this.isZero = function () {
    return current === 0 ? true : false;
  }

  this.isReady = function () {
    return ripple ? this.isZero() && ripple.isReady() : this.isZero();
  }

  this.affect = function (digit) {
    ripple = digit;
  }

  this.flip = function (forceValue) {
    if (forceValue || forceValue === 0) {

      interval = setInterval(function() { 
        if (current != forceValue) {
          tickTock(); 
        } else {
          clearInterval(interval);
        }
      }, params.delay);

    } else {
      tickTock();
    }
  }

  function animate() {
    if (params.play) {
      setTimeout(function () {
        interval = setInterval(function () { 
          tickTock(); 
        }, params.delay);
      }, params.offset);
    }
  }

  build();
  animate();
}


// Main Function
var Digits = function (params) {  
  var digits = [],
    classes = {
      main: 'digits',
      countdown: 'countdown',
      statistics: 'statistics'
    };    

  this.changeValue = function(newValue) {
    var p = digits.length - 1;
      newValue = newValue && newValue.toString() || '0';

    // Set new value
    for (var d = newValue.length - 1; d >= 0; d--) {
      if (digits[p]) {
        digits[p].flip(newValue[d]);
      } else {
        digits = digits.reverse();
        digits.push(new Digit({ name: ['statistic', 'statistic-' + (d + 1)], first: true, wrapper: params.wrapper, start: parseInt(newValue[d]), delay: 250, animationDelay: '.08s' }));
        digits = digits.reverse();
      }

      p--;
    }

    // Clear unwanted digits
    for (var d = 0; d <= digits.length - newValue.length - 1; d++) {
      digits[d].flip(0);
    }
  }

  function statistics() {
    if (!params.value) {
      throw Error('Missng value parameter');
    }

    params.value = params.value.toString();

    for (var d = 0; d< params.value.length; d++) {
      digits.push(new Digit({ name: ['statistic', 'statistic-' + (d + 1)], wrapper: params.wrapper, start: parseInt(params.value[d]), delay: 250, animationDelay: '.08s' }));
    }
  }

  function countdown() {
    var days,
      hours,
      minutes,
      seconds,
      labels,
      offset,
      diff;

    if (!params.to) {
      throw Error('Missing to parameter');
    }

    // Time difference
    diff = (new Date(params.to) - new Date());

    if (diff > 0) {
      
      // TODO: IMPROVE
      days = Math.floor(diff / 1000 / 60 / 60 / 24).toString();
      hours = Math.floor((diff / 1000 / 60 / 60) - (days * 24)).toString();
      minutes = Math.floor(((diff / 1000 / 60 / 60) - (days * 24) - hours) * 60).toString();
      seconds = Math.floor(((((diff / 1000 / 60 / 60) - (days * 24) - hours) * 60) - minutes) * 60).toString();
  
      // Fix initial out-of-sync delay
      offset = diff % 1000;
    
      // Add Leading zeros
      hours = hours.length === 1 ? '0' + hours : hours;
      minutes = minutes.length === 1 ? '0' + minutes : minutes;
      seconds = seconds.length === 1 ? '0' + seconds : seconds;

    } else {
      days = hours = minutes = seconds = '00';
    }

    // Days
    for (var d = 0; d < days.length; d++) {
      digits.push(new Digit({ name: ['day', 'day-' + (d + 1)], ready: params.ready, wrapper: params.wrapper, start: parseInt(days[d]) }));
    }

    // Hours
    digits.push(new Digit({ name: ['hour', 'hour-1'], ready: params.ready, wrapper: params.wrapper, start: parseInt(hours[0]), max: 2 }));    
    digits.push(new Digit({ name: ['hour', 'hour-2'], ready: params.ready, wrapper: params.wrapper, start: parseInt(hours[1]), max: 3, group: true }));

    // Minutes
    digits.push(new Digit({ name: ['minute', 'minute-1'], ready: params.ready, wrapper: params.wrapper, start: parseInt(minutes[0]), max: 5 }));
    digits.push(new Digit({ name: ['minute', 'minute-2'], ready: params.ready, wrapper: params.wrapper, start: parseInt(minutes[1]) }));

    // Seconds
    digits.push(new Digit({ name: ['second', 'second-1'], ready: params.ready, wrapper: params.wrapper, start: parseInt(seconds[0]), max: 5 }));
    digits.push(new Digit({ name: ['second', 'second-2'], ready: params.ready, wrapper: params.wrapper, start: parseInt(seconds[1]), play: diff > 0 ? true : false, offset: offset }));

    // Fire ready event when countdown is not required
    if (diff <= 0) {
      params.ready();
    }

    // Add labels
    if (params.labels) {
      labels = JS.createElement({ type: 'div', parent: params.wrapper, classes: ['labels'] });

      JS.createElement({ parent: labels, classes: ['label', 'days'], type: 'span' })
      JS.createElement({ parent: labels, classes: ['label', 'hours'], type: 'span' })
      JS.createElement({ parent: labels, classes: ['label', 'minutes'], type: 'span' })
      JS.createElement({ parent: labels, classes: ['label', 'seconds'], type: 'span' })
    }
    
    // Link digits
    for (var d = digits.length - 1; d > 0; d--) {
      digits[d].affect(digits[d-1]);
    }
  }

  function init() {
    // Check params
    if (params) {
      params.wrapper = params.wrapper && document.querySelector(params.wrapper);
      params.mode = params.mode || 'countdown';
      params.labels = params.labels || false;

      if (!params.wrapper) {
        throw Error('Missing parameters');
      } else {
        params.wrapper.innerHTML = '';
        params.wrapper = JS.createElement({ parent: params.wrapper, type: 'div', classes: [classes.main] });
      }
    } else {
      throw Error('Params not defined');
    }

    // Main Class
    params.wrapper.classList.add(classes.main);

    // Plugin mode
    switch (params.mode) {
      case 'countdown':
        params.wrapper.classList.add(classes.countdown);
        countdown();
        break;

      case 'statistics':
        params.wrapper.classList.add(classes.statistics);
        statistics();
        break;

      default:
        break;
    }
  }

  init();
}
