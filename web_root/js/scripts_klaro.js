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
	audioLength = 5; //ms
	onTouchHandler;
	handlerOptions = {capture: true};
	captureEvents = ['touchstart', 'touchend', 'mousedown'];
	
	// constructor() {
	// too early
	// }

	start() {
		this.audioCtx = PIXI.sound.context.audioContext; // new window.AudioContext();

		// Prepare audio samples for unlock-sound
		const bufferLength = Math.floor(this.audioLength * this.audioCtx.sampleRate / 1000);
		this.myArrayBuffer = this.audioCtx.createBuffer(1, bufferLength, this.audioCtx.sampleRate);
		var nowBuffering = this.myArrayBuffer.getChannelData(0);
		for (var i = 0; i < bufferLength; i++) {
			nowBuffering[i] = Math.random() * 0.01 - 0.005; // low volume noise, since total silence would maybe not be considered as sound
		}

		// Prepare touch event handler
		const me = this;
		this.onTouchHandler = function () {
			me.playFakeAudio(function(enabled){
				if (enabled) {
					me.hideUnlocker();
					for (const e of me.captureEvents) {
						document.removeEventListener(e, me.onTouchHandler, me.handlerOptions);
					}
				}
			})
		}

		this.unlocker = document.getElementById('audioUnlocker');

		this.enableAudio();
	}

	// Try to play a sound to unlock audio context. Works only in a user interaction event. If not started from there,
	// it then will display an unlocker dialog
	enableAudio() {
		const me = this;
		this.playFakeAudio( isAudioEnabled => me.playFakeAudioHandler(isAudioEnabled) );
	}

	// Play a simple audio and call back
	playFakeAudio(callback) {
		const source = this.audioCtx.createBufferSource();
		const me = this;

		// Indirect test if it has been playing
		source.onended = function (a) {
			me.unlocked = true;
			callback(true);
		}
		source.buffer = this.myArrayBuffer;
		source.connect(this.audioCtx.destination);
		source.start(0);

		// Direct test, if it already runs?
		if ( this.audioCtx.state === 'running') {
			// maybe already stop here? Reliable enough?
    } else {
			// If not played, then this timer will catch it a bit later
			setTimeout(() => { if (!me.unlocked) callback(false) }, this.audioLength + 300); "must be larger ms than audioLength"
		}
    
	}

	playFakeAudioHandler(isAudioEnabled) {

		const me = this;
		
		if (isAudioEnabled == false) {
			console.log('Audio NOT unlocked, waiting on next touch event');
			
			for (const e of this.captureEvents) {
				document.addEventListener(e, this.onTouchHandler, this.handlerOptions);
			}

// dont, since we might not even want to play audio			this.showUnlocker();
			
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
		if (this.unlocker) {
			this.unlocker.style.display = 'block';
			// Add JS to play sound on a user interaction, which unlocks the audio context
			this.unlocker.addEventListener('pointerdown', ()=>this.enableAudio() );
		} else {
			// fallback, if we are too early
			alert('Error: no sound');
		};
	}

	// Smart play a sound, or display the unlocker
	pixiPlay(id, options) {
		if (!this.unlocked) {
//			console.log('Locked audio: ' + id);
			this.showUnlocker();
		}
//		} else {
		if (PIXI.sound.exists(id)) {
			PIXI.sound.play(id, options);
		}
//		}
	}

	pixiAdd(id, options) {
		if (!PIXI.sound.exists(id)) {
			PIXI.sound.add(id, options);
		}	
	}
}

// Singleton instance
const audioPlayer = new AudioPlayer();


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


// ================== Screen wake lock ================

var screenWakeLock;

// create an async function to request a wake lock
async function screenWake_requestLock() {
  try {
    screenWakeLock = await navigator.wakeLock.request('screen');
//		alert('Die automatische Bildschirmabschaltung ist nun AUS.')
  } catch (err) {
    // if wake lock request fails - usually system related, such as battery
//		alert('Die automatische Bildschirmabschaltung konnte nicht deaktiviert werden.')
  }
}

function screenWake_handleVisibilityChange() {
  if (screenWakeLock !== null && document.visibilityState === 'visible') {
    screenWake_requestLock();
  }
}

// Used by application to turn ON
function screenWake_on() {

	// Browser feature check
	if ( ! 'wakeLock' in navigator) return;

	// Stop, if we already have a lock
	if (screenWakeLock) return;

  screenWake_requestLock();

  document.addEventListener('visibilitychange', screenWake_handleVisibilityChange);
	
}

// Used by application to turn OFF
function screenWake_off() {
	if (screenWakeLock && !screenWakeLock.released) {
		document.removeEventListener('visibilitychange', screenWake_handleVisibilityChange);
		screenWakeLock.release().then(() => {
//			alert('Die automatische Bildschirmabschaltung ist wieder normal.')
			screenWakeLock = null;
		})
	}
}



// ========= Haupt JS init ==============

setCookiesAllowed();

$(document).ready(function(){

	processHtmlDocument(document);
	
	preventBackButton(function(){
//TODO nice message		alert('No back function available');
	});

	// setTimeout( () => audioPlayer.enableAudio(), 5000);
	audioPlayer.start();

	if ( ! (typeof JoelPurra === 'undefined') ) {
		JoelPurra.PlusAsTab.setOptions({
			// Use the enter key as tab keys
			key: [13]
		});
	}
	
});
