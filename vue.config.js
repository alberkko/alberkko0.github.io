module.exports = {
	publicPath: '/online/',
	transpileDependencies: ['vuetify'],
	pluginOptions: {
		i18n: {
			locale: 'en',
			fallbackLocale: 'en',
			localeDir: 'locales',
			enableInSFC: true
		}
	},
	pwa: {
		name: 'Ironatlas',
		themeColor: '#666666',
		themeComsTileColorlor: '#b8bbdb',
		assetsVersion: '2.0.1',
		manifestOptions: {
			theme_color: '#666'
		}
	},
	css: {
		sourceMap: true
	}
}
