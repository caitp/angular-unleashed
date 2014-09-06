(function AngularUnleashedPresentation(global, Reveal) {
  var slice = Array.prototype.slice;
  slice.call(document.querySelectorAll('.reveal > .slides > section > section'), 0).forEach(function(node) {
    var background = document.createElement('div');
    background.className = 'background';
    node.insertBefore(background, node.firstChild);
  });
  Reveal.initialize({
    controls: false,
    progress: false,
    slideNumber: false,
    history: true,
    keyboard: true,
    center: true,
    touch: true,
    loop: false,
    rtl: false,
    fragments: true,
    embedded: false,
    autoSlide: 0,
    autoSlideStoppable: true,
    mouseWheel: false,
    hideAddressBar: true,
    previewLinks: false,
    transition: 'cube',
    transitionSpeed: 'default',
    backgroundTransition: 'default',
    viewDistance: 3,
    parallaxBackgroundImage: '',
    parallaxBackgroundSize: '',
    dependencies: [
      {
        src: '/third_party/reveal.js/lib/js/classList.js',
        condition: function() { return !document.body.classList; }
      },   
      {
        src: '/third_party/reveal.js/plugin/highlight/highlight.js',
        async: true,
        callback: function() { hljs.initHighlightingOnLoad(); }
      }
    ]
  });
})(this, Reveal);
