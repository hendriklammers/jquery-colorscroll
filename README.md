colorScroll
===========

A jQuery plugin that changes the background color of an element, based on the scroll position of the document.  

Currently it only works as scroll event on the document. So if the document's height doesn't exceed the window's height 
(i.e. There's nothing to scroll), no color transitions will be done.

Usage
-----
Call colorScroll on the element to which you want to apply the color transitions.  
For example to change the **background-color** of the **body** element you could use the plugin like this:
```js
$('body').colorScroll({
    colors: [{
        color: '#a2e9ff',
        position: '0%'
    }, {
        color: '#ff92f2',
        position: '40%'
    }, {
        color: '#fff094',
        position: '80%'
    }]
});
```

Example
-------
A very basic example of the plugin in action can be found [here](http://hendriklammers.github.io/jquery-colorscroll).
