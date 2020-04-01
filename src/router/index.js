import Vue from 'vue'
import VueRouter from 'vue-router'
import IMLandingLeft from '../views/IMLandingLeft.vue'
import MSLandingLeft from '../views/MSLandingLeft.vue'
import SectionLeft from '../views/SectionLeft.vue'
//import HomeView from '../views/HomeView.vue'
//import IMView from '../views/IMView.vue'
import i18n from '../i18n'
import VueGtag from 'vue-gtag'
Vue.use(VueRouter)
//const i18n = Vue.i18n

const routes = [
	{
		path: '/',
		name: 'landing',
		redirect: `/en`
	},
	{
		path: '/:locale',
		name: 'home',
		component: IMLandingLeft
	},
	{
		path: '/:locale/ironmetabolism',
		name: 'ironmetabolism',
		component: IMLandingLeft
	},
	{
		path: '/:locale/:id',
		name: 'microsite',
		props: true,
		component: MSLandingLeft
	},
	{
		path: '/:locale/:id',
		name: 'secondaryNavigation',
		props: true,
		component: MSLandingLeft
	},
	{
		path: '/:locale/ironmetabolism/:id/:element?',
		name: 'section',
		props: true,
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: SectionLeft
	}
]

const router = new VueRouter({
	routes
})

Vue.use(
	VueGtag,
	{
		config: { id: 'G-V3XEBMLH2K' }
	},
	router
)

router.beforeEach((to, from, next) => {
	//console.log('trigged ROUTE change', router)
	// Set nav transition state only if its not a language change
	if (to.params.id != from.params.id) {
		router.app.$store.commit('SET_NAV_TRANSITIONING', true)
	}

	let locale = '',
		localeUrlSegment = to.path.split('/'),
		currentLocale = i18n.locale

	// Get locale from path
	localeUrlSegment.shift()
	locale = localeUrlSegment[0]

	// Locale fallback
	if (locale === '') locale = currentLocale

	// Set locale
	i18n.locale = locale
	to.params.locale = locale
	/* if (typeof to.params.section == 'undefined') {
		to.params.section = 'ironmetabolism'
	} */
	// Move on the next hook (render component view)
	next()
})

export default router
