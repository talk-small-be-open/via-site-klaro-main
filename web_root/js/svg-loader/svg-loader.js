"use strict";

// Taken and extremely simplified for our needs, from MIT licensed SVG-Loader:
// https://github.com/shubhamjain/svg-loader

// returns promise
function svgLoadInline(elemId) {
	const elem = document.getElementById(elemId);
  const url = new URL(elem.getAttribute("data-svgloader-src"), globalThis.location);

	function renderBody(elem, body) {

		const parser = new DOMParser();
		const doc = parser.parseFromString(body, "text/html");
		const fragment = doc.querySelector("svg");

		// Copy the SVG content
		elem.innerHTML = fragment.innerHTML;

		// Copy the attributes on top level, no override
		for (let i = 0; i < fragment.attributes.length; i++) {
			const {
				name,
				value
			} = fragment.attributes[i];

			if (!elem.hasAttribute(name)) {
				elem.setAttribute(name, value);
			}
		}

		// Finished loading. Callback to some code from the app.
		//callback();
		
	};

	// Start the fetching of the file
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw Error(`Request for '${url.toString()}' returned ${response.status} (${response.statusText})`);
    }
		return response.text(); // promise!
  })
  .then((body) => {
    renderBody(elem, body);
  })
  .catch((e) => {
    console.error(e);
  });
};
