function isIos() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  }
  
  function isInStandaloneMode() {
    return ('standalone' in window.navigator) && (window.navigator as any).standalone;
  }
  
  if (isIos() && !isInStandaloneMode()) {
    // Show a custom banner to tell user: 
    // "Tap Share → Add to Home Screen"
    console.log("Show iOS install instructions");
  }
  