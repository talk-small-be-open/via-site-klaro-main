module.exports = {
  // multipass: false, // boolean
  // datauri: 'base64', // 'base64'|'enc'|'unenc'
  // js2svg: {
  //   indent: 4, // number
  //   pretty: true // boolean
  // },
  plugins: [
    // 'preset-default', // built-in plugins enabled by default
    // 'prefixIds', // enable built-in plugins by name

    {
      name: 'inlineStyles',
      params: {
				onlyMatchedOnce: false,
        removeMatchedSelectors: true
      }
    },
		'convertStyleToAttrs',
		'removeStyleElement',
		'removeUselessStrokeAndFill',
		{
      name: "cleanupIds",
      params: {
        remove: true,
        minify: false,
        preserve: [],
        preservePrefixes: ['Station', 'Kreis', 'Kreis', 'Hex', 'Haus', 'Land', 'Pfad', 'HG', 'Grund'],
        force: true
      }
    },
		'convertColors',
		'removeUselessDefs'
//		'reusePaths'
  ]
};
