import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import App from './App.vue'
//import './registerServiceWorker'
import router from './router'
import store from './store/store'
import vuetify from './plugins/vuetify'
import fullscreen from 'vue-fullscreen'
import i18n from './i18n'
import { sync } from 'vuex-router-sync'
import scrshot from 'js_screen_shots'
import { mapState } from 'vuex'
import '@/assets/global.scss'
import VueGtag from "vue-gtag";
import VueTouch from 'vue-touch';

Vue.use(fullscreen)

Vue.use(VueGtag, {
	config: { id: "G-V3XEBMLH2K" }
  });

Vue.use(VueTouch);

window.html2canvas = scrshot.html2canvas
window.Canvas2Image = scrshot.Canvas2Image

Vue.config.productionTip = false
const unsync = sync(store, router)
const requireComponent = require.context(
	'./components',
	false,
	/Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
	const componentConfig = requireComponent(fileName)

	const componentName = upperFirst(
		camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
	)

	Vue.component(componentName, componentConfig.default || componentConfig)
})

const VM = new Vue({
	router,
	store,
	vuetify,
	i18n,
	render: h => h(App),
	computed: {
		...mapState(['savescr'])
	},
	watch: {
		savescr(newValue) {
			let _this = this
			if (newValue == 2) {
				//let _this = this
				let target = document.getElementsByTagName('body')[0]
				let footerreferences = target.querySelector(
					'#footer-references'
				)
				window
					.html2canvas(target, {
						useCORS: true,
						foreignObjectRenderign: true,
						allowTaint: false,
						height:
							window.innerHeight +
							footerreferences.offsetHeight +
							20,
						onclone(dom) {
							dom.querySelector(
								'#copyright-watermark'
							).style.display = 'block'
							let animationcontrols = dom.querySelector('#AnimationPlayerToolbar')
							// console.log("anim controls:: "+animationcontrols)
							animationcontrols.parentNode.removeChild(
								animationcontrols
							)
							let scroverlay = dom.querySelector(
								'#screenshot-overlay'
							)
							scroverlay.parentNode.removeChild(scroverlay)
						}
					})
					.then(function(canvas) {
						//canvas.classList = 'scrcanvas'
						canvas.setAttribute('class', 'scrcanvas')
						target.insertAdjacentElement('beforeend', canvas)
						let type = 'png'
						let w = canvas.width
						let h = canvas.height + 50
						let date = new Date()
						let f =
							'Screenshot_' +
							date.getFullYear() +
							'-' +
							(date.getMonth() + 1) +
							'-' +
							date.getDate() +
							'_' +
							date.getHours() +
							'-' +
							date.getMinutes() +
							'-' +
							date.getSeconds()
						if (canvas.msToBlob) {
							// IE
							try {
								let blob = canvas.msToBlob()
								window.navigator.msSaveBlob(blob, f)
								canvas.parentNode.removeChild(canvas)
							} catch (error) {
								canvas.parentNode.removeChild(canvas)
							}
						} else {
							// CH, FF
							window.Canvas2Image.saveAsImage(
								canvas,
								w,
								h,
								type,
								f
							)
							canvas.parentNode.removeChild(canvas)
						}
						//canvas.parentNode.removeChild(canvas)
						_this.$store.commit('SET_SCR', 0)
					})
			}
		}
	},
	methods: {
		toggleFullscreen() {
			this.$fullscreen.toggle(this.$el, {
				wrap: false,
				callback: this.fullscreenChange
			})
		},
		fullscreenChange(fullscreen) {
			//console.log(fullscreen);
			this.$store.dispatch('toggleFullScreen', fullscreen)
		}
	},
	destroyed() {
		unsync()
	}
})

store.$app = VM
VM.$mount('#app')
