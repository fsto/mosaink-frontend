angular.module('mosaink.common')

.factory('supersizedHelpers', function() {
  var init = function() {
    $.supersized({
      slide_interval: 4000,   // Length between transitions
      transition: 8,          // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left, 8-Carousel Bottom
      transition_speed: 2000, // Speed of transition
      new_window: 0,          // Image links open in new window/tab
      keyboard_nav: 0,        // Keyboard navigation on/off
      performance: 1,         // 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
      min_width: 0,           // Min width allowed (in pixels)
      min_height: 0,          // Min height allowed (in pixels)
      vertical_center: 1,     // Vertically center background
      horizontal_center: 1,   // Horizontally center background
      fit_always: 0,          // Image will never exceed browser width or height (Ignores min. dimensions)
      fit_portrait: 1,        // Portrait images will not exceed browser height
      fit_landscape: 0,       // Landscape images will not exceed browser width
                             
      // Components             
      slide_links: false,     // Individual links for each slide (Options: false, 'num', 'name', 'blank')
      thumb_links: 0,         // Individual thumb links for each slide
      slides: [               // Slideshow Images
        {image : '/assets/images/bg-mosaink-wall.jpg'},
        {image : '/assets/images/bg-mosaink-close-up.jpg'}
      ],
                    
      // Theme Options         
      progress_bar      : 0,      // Timer for each slide             
      mouse_scrub       : 0
    });
  };

  return {
    init: init
  };
});