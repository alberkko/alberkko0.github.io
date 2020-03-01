<template>
	<v-container class="fill-height animation-section">
		<!-- <div class="blink_me" v-if="!animloaded">LOADING ANIMATION</div> -->
		<div id="loading-wrapper" v-if="!animloaded">
			<div id="loading-text">LOADING</div>
			<div id="loading-content"></div>
		</div>
		<Minimap></Minimap>
		<v-row justify="center" align="center">
			<!-- Here is injected the animation player... -->
		</v-row>
	</v-container>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import Minimap from './Minimap'
export default {
	name: 'AnimationPlayer',
	components: {
		Minimap
	},
	data: () => ({
		captureclass: 'animationcapture',
		animloaded: false
	}),
	computed: {
		...mapState([
			'paramkey',
			'previewpanels',
			'showlabels',
			'selectedElement',
			'currentlang',
			'tourmode',
			'tourautoplay',
			'tourcurrentstep',
			'toursteptransitioning',
			'tourstepjump',
			'sound',
			'savescr'
		]),
		...mapGetters(['location'])
	},
	watch: {
		previewpanels(newValue) {
			//console.log('Updating from ' + oldValue + ' to ' + newValue)
			window.iron3d.preview(newValue)
		},
		showlabels(newValue) {
			if (newValue) {
				window.iron3d.showLabels(true)
			} else {
				window.iron3d.showLabels(false)
			}
		},
		currentlang(newValue) {
			if (typeof window.iron3d != 'undefined') {
				window.iron3d.setLanguage(newValue)
			}
		},
		savescr(newValue) {
			let _this = this
			if (newValue == 1) {
				let canvas = this.$el.getElementsByTagName('canvas')[0]
				window.iron3d.capture(img => {
					img.className = _this.captureclass
					canvas.parentElement.insertAdjacentElement('afterend', img)
					_this.$store.commit('SET_SCR', 2)
				})
			} else if (newValue == 0) {
				let img = _this.$el.querySelectorAll(
					'.' + _this.captureclass
				)[0]
				img.parentNode.removeChild(img)
			}
		},
		sound(newValue) {
			window.iron3d.setMute(newValue)
		},
		tourmode(newValue) {
			if (newValue) {
				let didenter = window.iron3d.setStepByStepMode(true)
				window.iron3d.showLabels(true)
				this.$store.commit('TOGGLE_TOUR_STEPTRANSITIONING', true)
				if (didenter) {
					window.iron3d.select(null)
					if (this.tourstepjump) {
						window.iron3d.jumpToStep(self.tourcurrentstep)
					} else {
						window.iron3d.playUntilStep(self.tourcurrentstep)
					}
				}
				//window.iron3d.playUntilStep(self.tourcurrentstep)
			} else {
				window.iron3d.setStepByStepMode(false)
				if (!this.showlabels) {
					window.iron3d.showLabels(false)
				}
			}
		},
		tourcurrentstep(newValue) {
			this.$store.commit('TOGGLE_TOUR_STEPTRANSITIONING', true)
			if (this.tourstepjump) {
				window.iron3d.jumpToStep(newValue)
			} else {
				window.iron3d.playUntilStep(newValue)
			}
		},
		tourstepjump(newValue) {
			if (newValue) {
				window.iron3d.jumpToStep(this.tourcurrentstep)
			}
		},
		$route(to, from) {
			//console.log(this.$route)
			if (to.name === 'home') {
				window.iron3d.navigate('navigation')
				this.$store.commit('EMPTY_PREVIEW')
			} else {
				//window.iron3d.navigate(this.location.currentnode[this.paramkey])
				if (
					typeof to.params.id !== 'undefined' &&
					to.params.id != from.params.id
				) {
					window.iron3d.navigate(
						this.location.currentnode[this.paramkey]
					)
				} else {
					if (typeof to.params.element !== 'undefined') {
						window.iron3d.select(to.params.element)
					} else {
						window.iron3d.select(null)
					}
				}
			}
		}
	},
	methods: {
		...mapActions(['chageTourStep'])
	},
	mounted() {
		//console.log("AnimationPlayer", this.$el);
		let iron3dScript = document.createElement('script')
		iron3dScript.id = 'iron3dscript'
		iron3dScript.src = './ironanimation/main.js?v=1.0'
		this.$el.appendChild(iron3dScript)
		const self = this
		iron3dScript.onload = () => {
			let languages = ['en', 'de', 'fr', 'es']
			let previewId = 'none'
			let showLabels = false

			self.$on('CLICK_SOUND', () => {
				window.iron3d.playClickSound()
			})

			// STEP 1: Setup callbacks
			// To avoid confusion, everything tunnels throw this, no navigation is handled inside the app.
			window.iron3d.setPreviewCallback(id => {
				//console.log('preview callback, previewId:' + id)

				if (previewId == id) previewId = 'none'
				else previewId = id

				//window.iron3d.preview(previewId)
				self.$store.commit('SET_PREVIEW', previewId)
			})
			window.iron3d.setNavigationCallback(id => {
				//console.log('navigation callback, navigationId:' + id, self)
				if (id !== 'navigation') {
					self.$router.push({ name: 'section', params: { id: id } })
				} else {
					self.$router.push({ name: 'home' })
				}
				//window.iron3d.navigate(id)
				self.$store.commit('CHANGE_STEP', 1)
				self.$store.commit('TOGGLE_TOUR_STEPJUMP', false)
				previewId = 'none' //we reset this one on every navigation event.
			})

			window.iron3d.setSelectionCallback(id => {
				if (id) {
					//console.log('selection callback, selectionId:' + id)
					//this.$store.commit('SET_ELEMENT', id)
					self.$router.push({
						name: 'section',
						params: {
							id: self.location.currentnode[self.paramkey],
							element: id
						}
					})
				} else {
					//this.$store.commit('EMPTY_ELEMENT')
					self.$router.push({
						name: 'section',
						params: { id: self.location.currentnode[self.paramkey] }
					})
				}
			})

			// Handle selectin if already set
			window.iron3d.setAnimationReadyCallback(animationID => {
				//console.log('aimation ready')
				if (self.tourmode) {
					window.iron3d.setStepByStepMode(true)
					if (self.tourstepjump) {
						window.iron3d.jumpToStep(1)
					} else {
						window.iron3d.playUntilStep(1)
					}
				} else {
					if (
						typeof self.$route.params.element !== 'undefined' &&
						self.$route.params.id == animationID
					) {
						window.iron3d.select(self.$route.params.element)
					}
				}
				self.$store.commit('SET_NAV_TRANSITIONING', false)
			})

			// Handle Step reached
			//toursteptransitioning
			window.iron3d.setStepReachedCallback(() => {
				//animationID, stepIndex, lastStep
				self.$store.commit('TOGGLE_TOUR_STEPJUMP', false)
				self.$store.commit('TOGGLE_TOUR_STEPTRANSITIONING', false)
				if (self.tourautoplay) {
					window.setTimeout(() => {
						this.chageTourStep('next', false)
					}, 10000)
				}
			})

			// STEP 2: Launch
			let navigation =
				this.$route.name != 'home'
					? this.$route.params.id
					: 'navigation'
			window.iron3d.launch(this.currentlang, navigation, true, true)
			//optionally you can set the animation.
			//window.iron3d.launch( 'en', "transport1" );

			// STEP 3: Now you can interact with the app.
			window.addEventListener('keydown', ke => {
				switch (ke.code) {
					case 'KeyL':
						languages.push(languages.shift())
						window.iron3d.setLanguage(languages[0]) //change the language.
						break

					case 'KeyT':
						showLabels = !showLabels
						//window.iron3d.showLabels(showLabels) //hide or show labels. On the main navigation that's the quantities.
						self.$store.commit('TOGGLE_LABELS')
						break

					case 'KeyP':
						if (previewId == 'all') previewId = 'none'
						else previewId = 'all'
						window.iron3d.preview(previewId)
						break
				}
			})

			window.iron3d.setBlockingLoadingOverCallback(() => {
				self.animloaded = true
			})
		}
	}
}
</script>

<style>
.iron3d-controls #up:before,
#iron3d .regulation1.icon:before {
	top: 100px;
	left: 0;
}
.animationcapture {
	position: absolute;
}
.animation-section {
	max-width: 100%;
	background: rgb(187, 189, 222);
	background: linear-gradient(
		0deg,
		rgba(187, 189, 222, 1) 0%,
		rgba(255, 255, 255, 1) 100%
	);
}
.mobile-view .iron3d-controls #top {
	display: none;
}
.blink_me {
	z-index: 999999;
	position: absolute;
	right: 15px;
	top: 15px;
	font-size: 16px;
	animation: blinker 2s linear infinite;
}
#loading-wrapper {
	z-index: 999999;
}

.utility-toolbar {
	z-index: 999999;
}

@keyframes blinker {
	50% {
		opacity: 0;
	}
}
</style>
