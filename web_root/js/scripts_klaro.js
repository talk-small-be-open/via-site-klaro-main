// JavaScript für Klaro


// PWA Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
		.then(serviceWorker => {
//      console.log("Service Worker registered: ", serviceWorker);
    })
    .catch(error => {
      console.error("Error registering the Service Worker: ", error);
    });
}


function swapElement(a, b) {
  // create a temporary marker div
  var aNext = $('<div>').insertAfter(a);
  a.insertAfter(b);
  b.insertBefore(aNext);
  // remove marker div
  aNext.remove();
}

function swapContent(a, b) {

	var as = a.children();

	b.children().appendTo(a);
	as.appendTo(b);
	
}


// Work globally with some objects in a context. Used globally in the first place,
// but also when content is being loaded partially
function processHtmlDocument(contextElement) {
  $('textarea', contextElement).autosize();
}

/* =========== PAGER ================ */

// provided by seaside: function pager_getPager()

function pager_gotoPage(pagerId, pageId) {
	processHtmlDocument(pageId);
	$('div.klaroPage', pagerId).removeClass('current slide');

	// Slide-In Animation! See CSS ...
	
	$(pageId).addClass('current slide');
}



/* ====== TIMER ============ */

var countdown_milliseconds = 0;
var countdown_milliseconds_togo = 0;
const countdown_step = 100;
var countdown_interval;
var countdown_finished_callback;


function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(centerX, centerY, radius, endAngle){

    var start = polarToCartesian(centerX, centerY, radius, endAngle);
    var end = polarToCartesian(centerX, centerY, radius, 0);

    var largeArcFlag = endAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
}

function countdown_redraw() {
	const completness = countdown_milliseconds_togo / countdown_milliseconds;
	$("span.mainButton.active svg.sign path.timerArc").attr('d', describeArc(35, 35, 32, 360 * completness))
}

function countdown_pause() {
	clearInterval(countdown_interval);
	countdown_interval = null;
}

function countdown_continue() {
	countdown_interval = setInterval(countdown_interval_ticker, countdown_step);
}

function countdown_is_running() {
	return countdown_interval != null;
}

function countdown_toggle() {
	if (countdown_is_running()) {
		countdown_pause();
	} else {
		countdown_continue();
	}
}

// function countdown_stop() {
// 	countdown_milliseconds = 0;
// 	clearInterval(countdown_interval);
// 	countdown_redraw();
// }

function countdown_finished() {
	clearInterval(countdown_interval);
	countdown_redraw();
	countdown_finished_callback();
}

function countdown_start(seconds, finishedCallback) {
	countdown_milliseconds = seconds * 1000;
	countdown_milliseconds_togo = countdown_milliseconds;
	countdown_finished_callback = finishedCallback;
	countdown_continue();
}

function countdown_interval_ticker() {
	countdown_milliseconds_togo -= countdown_step;
	if (countdown_milliseconds_togo <= 0) {
		countdown_finished();
	} else {
		countdown_redraw();
	}
	
}


/* Haupt JS init */
$(document).ready(function(){

	processHtmlDocument(document);
	
	preventBackButton(function(){
//TODO nice message		alert('No back function available');
	});

});
