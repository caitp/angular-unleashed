(function AngularUnleashedPresentation(global, Reveal) {
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
    fragments: false,
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
      }
    ]
  });
})(this, Reveal);
