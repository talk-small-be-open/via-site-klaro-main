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

	if ( ! (typeof JoelPurra === 'undefined') ) {
		$('input.clozeTextPlaceholder', contextElement).plusAsTab();
	}

}


// Default global error handler
window.onerror = (a, b, c, d, e) => {
  console.log(`message: ${a}`);
  console.log(`source: ${b}`);
  console.log(`lineno: ${c}`);
  console.log(`colno: ${d}`);
  console.log(`error: ${e}`);

	// Ignore some typical errors which we dont bother
	if (e instanceof DOMException) { return false }
	
	javascriptErrorStandardBehaviour(e);

	// Continue with handling the error
  return false;
};

function javascriptErrorStandardBehaviour(errorIfAny) {
	if (confirm('Ups, verhext! Da war ein Fehler, wir rufen nun den Zauberlehrer! Hokus pokus Zaubermaden, die Klaro-App wird neu geladen!')) {
		window.location.reload();
	}
}

/* =========== PAGER ================ */

// provided by seaside: function pager_getPager()

function pager_gotoPage(pagerId, pageId, isBack = false, transition = 'slide') {

	// Transition names: silde, appear
	processHtmlDocument(pageId);
	window.scroll({behavior: 'auto', top: 0});

	const appearanceStyle = isBack ? (transition + '-back') : transition;
	
	$('div.klaroPage', pagerId).removeClass('current slide slide-back appear appear-back');

	// Slide-In Animation! See CSS ...
	
	$(pageId).addClass('current ' + appearanceStyle);
}



/* ====== TIMER ============ */

class SpeedReaderTimer {
	milliseconds = 0;
	millisecondsTogo = 0;
	step = 500; // Ticker-Step Dauer in ms
	interval;
	finishedCallback;
	syncCallback;
	gameBoard;
	animeAnimation;
//	speedFactor = 1;
	isStateRunning = null; // must be NOT set

	// constructor() {
	// }


	init(gameBoardId, milliseconds, finishedCallback, syncCallback) {
		// If been re-init, then we assure that we clean up the existing running stuff
		this.stopAllTimers();

		this.gameBoard = $('#'+gameBoardId);
		this.milliseconds = milliseconds;
		this.millisecondsTogo = this.milliseconds;
		this.finishedCallback = finishedCallback;
		this.syncCallback = syncCallback;
//		this.redraw();
//		this.beSpeedNormal();

	}


	// beSpeedNormal() {
	// 	this.speedFactor = 1;
	// }

	// beSpeedFast() {
	// 	this.speedFactor = 0.75;
	// }

	// beSpeedSlow() {
	// 	this.speedFactor = 2;
	// }

	syncWithServer() {
		var data = this.isRunning();
		this.syncCallback(data);
	}
	
	pause() {
		this.isStateRunning = false;
		this.syncWithServer();
		this.stopAllTimers();

		this.gameBoard.removeClass('playing').addClass('pausing');
		if (this.animeAnimation) { this.animeAnimation.pause() }
	}

	stopAllTimers() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	}
	
	continue(sync = true) {
		this.isStateRunning = true;
		if (sync) { this.syncWithServer(); }

		this.interval = setInterval( () => { this.intervalTicker() }, this.step);
		this.gameBoard.removeClass('pausing').addClass('playing');
		if (this.animeAnimation) { this.animeAnimation.play() }
	}

	isRunning() {
		return this.isStateRunning === true
//		return this.interval != null;
	}

	isPaused() {
		return this.isStateRunning === false
	}

	
	toggle() {
		if (this.isRunning()) {
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
		// this.redraw();
		this.finishedCallback();
		if (this.animeAnimation) { this.animeAnimation.pause() }

	}

	start(sync = true) {
		this.continue(sync);
	}

	stop() {
		if (this.isRunning()) {
			this.pause();
		}
	}

	autostart() {
		if (!this.isPaused()) { this.start(false) }
	}

	loadAnimation(animeAnimation) {
		this.animeAnimation = animeAnimation;
	}

	intervalTicker() {
		this.millisecondsTogo = this.millisecondsTogo - this.step;
		if (this.millisecondsTogo <= 0) {
			this.finished();
		} else {
			//this.redraw();
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


// ================ UI Events ====================

// Event Handler for passive side elements, which will trigger the default button
// For convenience in UI
function catchPointerAndRetriggerDefaultButton(event) {
	const t = $(event.target);
	if ( t.hasClass('triggerDefaultButton') ||  t.parentsUntil(event.currentTarget).hasClass('triggerDefaultButton') ) {
		// console.log(event);
		$('.gameDefaultButton', event.currentTarget).trigger(event.type);
	}
}




// ========= Haupt JS init ==============
$(document).ready(function(){

	processHtmlDocument(document);
	
	preventBackButton(function(){
//TODO nice message		alert('No back function available');
	});

	enableAudio();

	if ( ! (typeof JoelPurra === 'undefined') ) {
		JoelPurra.PlusAsTab.setOptions({
			// Use the enter key as tab keys
			key: [13]
		});
	}

	
});
