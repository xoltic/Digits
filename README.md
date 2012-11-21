
Digits
====

[Demo](http://www.kennethcachia.com/digits)

Includes
---

**Core Files**

    <script src="digits.js"></script>

    <link rel="stylesheet" type="text/css" href="digits.css">

**Skins**
   
Choose one from the following skins:

    <link rel="stylesheet" type="text/css" href="digits-default.css">

    <link rel="stylesheet" type="text/css" href="digits-white.css">

Mode 1: Countdown
---

Countdown to a specific date.

    new Digits({
      wrapper: '#wrapper',
      mode: 'countdown',
      to: 'January 1 2013 00:00:00',
      labels: true,
      ready: function () {
        alert('Happy New Year!');
      }
    });

**wrapper**: class/ID of (empty) element where digits are displayed

**to**: countdown to this date

**labels**: show/hide labels (Days, Hours, Minutes, Seconds)

**ready**: function to be executed when counter reaches zero

Mode 2: Statistics
---

Start off with an initial value. Can also be changed at runtime.

    var stats = new Digits({ 
      wrapper: '#wrapper', 
      mode: 'statistics', 
      value: 199 
    });  

**wrapper**: class/ID of (empty) element where digits are displayed

**value**: initial value


Value can be changed at runtime using: 

    stats.changeValue(240);

