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
	//  $('textarea', contextElement).autosize();
}

/* =========== PAGER ================ */

// provided by seaside: function pager_getPager()

function pager_gotoPage(pagerId, pageId) {
	processHtmlDocument(pageId);
	$('div.klaroPage', pagerId).removeClass('current appear');

	// Slide-In Animation! See CSS ...
	
	$(pageId).addClass('current appear');
}



/* ====== TIMER ============ */

class SpeedReaderTimer {
	milliseconds = 0;
	milliseconds_togo = 0;
	step = 100;
	interval;
	finished_callback;
	gameBoard;
	animeAnimation;
	speedFactor = 1;

	// constructor() {
	// }


	init(gameBoardId, seconds, finishedCallback) {
		this.gameBoard = $('#'+gameBoardId);
		this.milliseconds = seconds * 1000 * this.speedFactor;
		this.milliseconds_togo = this.milliseconds;
		this.finished_callback = finishedCallback;
		this.redraw();
		this.be_speed_normal();
	}


	be_speed_normal() {
		this.speedFactor = 1;
	}

	be_speed_fast() {
		this.speedFactor = 0.75;
	}

	be_speed_slow() {
		this.speedFactor = 2;
	}

	redraw() {
		//	var completness = this.milliseconds_togo / this.milliseconds;
		// if (completness == 1) { completness = 0.999 }
		// $("span.mainButton.active svg.sign path.timerArc").attr('d', describeArc(35, 35, 32, 360 * completness))
	}

	pause() {
		clearInterval(this.interval);
		this.interval = null;
		this.gameBoard.removeClass('playing').addClass('pausing');
		if (this.animeAnimation) { this.animeAnimation.pause() }
	}

	continue() {
		this.interval = setInterval( () => { this.interval_ticker() }, this.step);
		this.gameBoard.removeClass('pausing').addClass('playing');
		if (this.animeAnimation) { this.animeAnimation.play() }
	}

	is_running() {
		return this.interval != null;
	}

	toggle() {
		if (this.is_running()) {
			this.pause();
		} else {
			this.continue();
		}
	}

	// function this.stop() {
	// 	this.milliseconds = 0;
	// 	clearInterval(this.interval);
	// 	this.redraw();
	// }

	finished() {
		clearInterval(this.interval);
		this.redraw();
		this.finished_callback();
		if (this.animeAnimation) { this.animeAnimation.pause() }

	}

	start() {
		this.continue();
	}

	load_animation(animeAnimation) {
		this.animeAnimation = animeAnimation;
	}

	interval_ticker() {
		this.milliseconds_togo = this.milliseconds_togo - this.step;
		if (this.milliseconds_togo <= 0) {
			this.finished();
		} else {
			this.redraw();
		}
		
	}


	
}

// Singleton instance
const speedReaderTimer = new SpeedReaderTimer();


// =============== AUDIO ================
function enableAudio () {
  var bufferLength = 10;
  var audioCtx = new window.AudioContext();
  var myArrayBuffer = audioCtx.createBuffer(1, bufferLength, audioCtx.sampleRate);


	// if (audioCtx.state !== 'suspended') return;

  var nowBuffering = myArrayBuffer.getChannelData(0);
  for (var i = 0; i < bufferLength; i++) {
    nowBuffering[i] = Math.random() * 0.1 - 0.05; // low volume noise
  }

  function playFakeAudio (callback) {
    var done = false;
		var source = audioCtx.createBufferSource();
    source.onended = function (a) {
      done = true;
      callback(true);
    }
		source.buffer = myArrayBuffer;
		source.connect(audioCtx.destination);
    source.start(0);

		// If not played, then this timer will catch it a bit later
    setTimeout(function () {if (!done) callback(false)}, 50); "Precise milliseconds: audioCtx.sampleRate * 1000 * bufferLength"
  }

  playFakeAudio(function (isAudioEnabled) {
    if (isAudioEnabled == false) {
			console.log('Audio NOT unlocked, waiting on next touch event');

			// Trying to catch the next touch event
			var onTouch = function () {
        playFakeAudio(function(){
					// Remove event handler, no matter if successful or not
          document.removeEventListener('touchstart', onTouch)
        })
      }
      // TODO SHow nice dialog to click on: document.write('<h3>BITTE HIER KLICKEN, UM DEN TON EINZUSCHALTEN</h3>')
      document.addEventListener('touchstart', onTouch)
    } else {
			console.log('Audio UNLOCKED');
		}
  })
}



// function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
//   var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

//   return {
//     x: centerX + (radius * Math.cos(angleInRadians)),
//     y: centerY + (radius * Math.sin(angleInRadians))
//   };
// }

// function describeArc(centerX, centerY, radius, endAngle){

//     var start = polarToCartesian(centerX, centerY, radius, endAngle);
//     var end = polarToCartesian(centerX, centerY, radius, 0);

//     var largeArcFlag = endAngle <= 180 ? "0" : "1";

//     var d = [
//         "M", start.x, start.y, 
//         "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
//     ].join(" ");

//     return d;       
// }



/* Haupt JS init */
$(document).ready(function(){

	processHtmlDocument(document);
	
	preventBackButton(function(){
//TODO nice message		alert('No back function available');
	});

	enableAudio();

});
