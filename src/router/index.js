import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Section from '../views/Section.vue'
import i18n from '../i18n'
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
		component: Home
	},
	{
		path: '/:locale/:id/:element?',
		name: 'section',
		props: true,
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: Section
	}
]

const router = new VueRouter({
	routes
})

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
	// Move on the next hook (render component view)
	next()
})

export default router
