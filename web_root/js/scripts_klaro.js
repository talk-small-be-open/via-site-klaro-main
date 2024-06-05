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
class AudioPlayer {
	unlocked = false;
	unlocker;
	audioCtx;
	myArrayBuffer;
	
	// constructor() {
	// }
	
	enableAudio() {
		var bufferLength = 10;
		this.audioCtx = new window.AudioContext();
		this.myArrayBuffer = this.audioCtx.createBuffer(1, bufferLength, this.audioCtx.sampleRate);
//		const me = this;

		this.unlocker = document.getElementById('audioUnlocker');

		// if (audioCtx.state !== 'suspended') return;

		var nowBuffering = this.myArrayBuffer.getChannelData(0);
		for (var i = 0; i < bufferLength; i++) {
			nowBuffering[i] = Math.random() * 0.1 - 0.05; // low volume noise
		}

//		this.playFakeAudio(function (isAudioEnabled) { me.playFakeAudioHandler(isAudioEnabled) } ));
		this.playFakeAudio( this.playFakeAudioHandler.bind(this) );

	}

	// Play a silent audio and call back
	playFakeAudio(callback) {
		const source = this.audioCtx.createBufferSource();
		const me = this;
		source.onended = function (a) {
			me.unlocked = true;
			callback(true);
		}
		source.buffer = this.myArrayBuffer;
		source.connect(this.audioCtx.destination);
		source.start(0);

		// If not played, then this timer will catch it a bit later
		setTimeout(function () {if (!me.unlocked) callback(false)}, 100); "Precise milliseconds: audioCtx.sampleRate * 1000 * bufferLength"
	}

	playFakeAudioHandler(isAudioEnabled) {

		const me = this;
		
		if (isAudioEnabled == false) {
			console.log('Audio NOT unlocked, waiting on next touch event');

			// Trying to catch the next touch event, and try again
			var onTouch = function () {
				me.playFakeAudio(function(){
					// Remove event handler, no matter if successful or not
					document.removeEventListener('touchstart', onTouch);
					document.removeEventListener('click', onTouch);
					me.hideUnlocker();
				})
			}

			// TODO: on mouse, keyboard?
			document.addEventListener('touchstart', onTouch);
			document.addEventListener('click', onTouch);

//			if (this.unlocker) { this.unlocker.style.display = 'block' };

		} else {
			console.log('Audio UNLOCKED');

			// Probably not needed, but better be safe and hide the dialog (maybe due to race conditions)
			this.hideUnlocker();
		}
	}

	hideUnlocker() {
			if (this.unlocker) { this.unlocker.style.display = 'none' };		
	}

	showUnlocker() {
			if (this.unlocker) { this.unlocker.style.display = 'block' };
	}

	// Smart play a sound, or display the unlocker
	pixiPlay(id, options) {
		if (!this.unlocked) {
			this.showUnlocker();
		}
		if (PIXI.sound.exists(id)) {
			PIXI.sound.play(id, options);
		}
	}
}

// Singleton instance
const audioPlayer = new AudioPlayer();



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

setCookiesAllowed();

$(document).ready(function(){

	processHtmlDocument(document);
	
	preventBackButton(function(){
//TODO nice message		alert('No back function available');
	});

	audioPlayer.enableAudio();

	if ( ! (typeof JoelPurra === 'undefined') ) {
		JoelPurra.PlusAsTab.setOptions({
			// Use the enter key as tab keys
			key: [13]
		});
	}

	
});
