<template>
	<v-touch
		class="fill-height animation-section"
		v-on:swipeleft="callNextAnimation"
		v-on:swiperight="callPrevAnimation"
	>
		<!-- <div class="blink_me" v-if="!animloaded">LOADING ANIMATION</div> -->
		<div id="loading-wrapper" v-if="!animloaded">
			<div id="loading-text">LOADING</div>
			<div id="loading-content"></div>
		</div>
		<Minimap></Minimap>
		<UtilityToolbar></UtilityToolbar>
		<AnimationPlayerToolbar
			v-if="isSection"
			@prev-animation="callPrevAnimation"
			@next-animation="callNextAnimation"
			@seek="seek"
			:playprogress="playprogress"
			:stepsprogress="stepsprogress"
		></AnimationPlayerToolbar>
		<AnimationSubtitles v-if="isSection" />
		<v-row justify="center" align="center">
			<!-- Here is injected the animation player... -->
		</v-row>
	</v-touch>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import Minimap from './Minimap'
import UtilityToolbar from './UtilityToolbar'
import AnimationPlayerToolbar from './AnimationPlayerToolbar'
import AnimationSubtitles from './AnimationSubtitles'
export default {
	name: 'AnimationPlayer',
	components: {
		Minimap,
		AnimationPlayerToolbar,
		UtilityToolbar,
		AnimationSubtitles
	},
	data: () => ({
		captureclass: 'animationcapture',
		animloaded: false,
		playprogress: 0,
		loadingNextStep: false,
		stepsprogress: [],
		stepsPlaylist: [
			'absorption1',
			'absorption2',
			'transport1',
			'usage1',
			'usage2',
			'usage3',
			'usage4',
			'loss1',
			'recycling1',
			'storage1',
			'regulation2',
			'regulation3'
		]
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
			'tourstepplaying',
			'sound',
			'animationplaying',
			'animationloading',
			'animationinterrupted',
			'manualprogress',
			'savescr'
		]),
		...mapGetters(['location', 'isSection'])
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
		sound(notMuted) {
			window.iron3d.setMute(!notMuted)
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
			if (this.tourstepjump) {
				window.iron3d.jumpToStep(newValue)
			} else {
				this.$store.commit('TOGGLE_TOUR_STEPTRANSITIONING', true)
				window.iron3d.playUntilStep(newValue)
			}
		},
		tourstepjump(newValue) {
			if (newValue) {
				window.iron3d.jumpToStep(this.tourcurrentstep)
			}
		},
		animationplaying(playing) {
			if (window.iron3d) {
				if (playing) {
					window.iron3d.play()
				} else {
					window.iron3d.pause()
				}
				//window.iron3d.togglePlayPause()
			}
		},
		animationinterrupted(interrupted) {
			if (window.iron3d) {
				if (interrupted) {
					window.iron3d.interrupt()
				} else {
					window.iron3d.resume()
				}
				//window.iron3d.togglePlayPause()
			}
		},
		$route(to, from) {
			//console.log(to)
			if (to.name != 'section') {
				window.iron3d.navigate('navigation')
				this.$store.commit('EMPTY_PREVIEW')
				//this.$store.commit('TOGGLE_TOUR_MODE')
				this.$store.commit('TOGGLE_ANIMATIONPLAYING', false)
			} else {
				//window.iron3d.navigate(this.location.currentnode[this.paramkey])
				//this.$store.commit('TOGGLE_ANIMATIONPLAYING', true)
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

			if (to.name == 'section' || to.name == 'ironmetabolism') {
				this.$store.commit('TOGGLE_ANIMATIONINTERRUPTED', false)
				this.$store.commit('TOGGLE_SOUND_ON', true)
			} else {
				this.$store.commit('TOGGLE_ANIMATIONINTERRUPTED', true)
				this.$store.commit('TOGGLE_SOUND_ON', true)
			}
		}
	},
	methods: {
		...mapActions(['chageTourStep']),
		getPreviousAnimationName() {
			let currentAnimationIndex = this.stepsPlaylist.indexOf(
				this.location.currentnode[this.paramkey]
			)

			return this.stepsPlaylist[
				(this.stepsPlaylist.length + (currentAnimationIndex - 1)) %
					this.stepsPlaylist.length
			]
		},
		getNextAnimationName() {
			let currentAnimationIndex = this.stepsPlaylist.indexOf(
				this.location.currentnode[this.paramkey]
			)

			return this.stepsPlaylist[
				(currentAnimationIndex + 1) % this.stepsPlaylist.length
			]
		},
		callPrevAnimation() {
			//console.log(this.location.prevanimation[this.paramkey])
			this.$router.push({
				name: 'section',
				params: { id: this.location.prevanimation[this.paramkey] }
			})
			this.$store.commit('CHANGE_STEP', 1)
		},
		callNextAnimation() {
			console.log('next animation called')
			this.$router.push({
				name: 'section',
				params: { id: this.location.nextanimation[this.paramkey] }
			})
			this.$store.commit('CHANGE_STEP', 1)
		},
		seek(progress) {
			//console.log(progress)
			window.iron3d.seek(progress)
		}
	},
	beforeMount() {
		this.$store.commit('TOGGLE_ANIMATIONPLAYING', true)
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

			let getLastStepIndex = animationID => {
				switch (animationID) {
					case 'absorption1':
						return 8
					case 'absorption2':
						return 4
					case 'transport1':
						return 3
					case 'usage1':
						return 5
					case 'usage2':
						return 3
					case 'usage3':
						return 1
					case 'usage4':
						return 6
					case 'loss1':
						return 2
					case 'recycling1':
						return 4
					case 'storage1':
						return 3
					case 'regulation2':
						return 1
					case 'regulation3':
						return 4
				}
			}

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
					self.$router.push({
						name: 'section',
						params: { id: id }
					})
				} else {
					self.$router.push({ name: 'ironmetabolism' })
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
						params: {
							id: self.location.currentnode[self.paramkey]
						}
					})
				}
			})

			// Handle selectin if already set
			window.iron3d.setAnimationReadyCallback(
				(animationID, stepsProgresses) => {
					// let lastStepIndex = getLastStepIndex( animationID );
					window.iron3d.lastStepIndex = getLastStepIndex(animationID)
					this.$store.commit('TOGGLE_ANIMATIONLOADING', false)
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
					self.stepsprogress = stepsProgresses
				}
			)

			// Handle Step reached
			//toursteptransitioning
			window.iron3d.setStepReachedCallback(() => {
				// animationID, stepIndex, lastStep
				self.$store.commit('TOGGLE_TOUR_STEPJUMP', false)
				self.$store.commit('TOGGLE_TOUR_STEPTRANSITIONING', false)
			})

			window.iron3d.setEndReachedCallback(
				(animationID, stepIndex, lastStep) => {
					console.log(
						'end reached in animation ' +
							animationID +
							stepIndex +
							lastStep
					)

					this.$router.push({
						name: 'section',
						params: {
							id: this.location.nextanimation[this.paramkey]
						}
					})
					this.$store.commit('CHANGE_STEP', 1)
				}
			)

			// STEP 2: Launch
			let navigation =
				this.$route.name == 'section'
					? this.$route.params.id
					: 'navigation'
			let normalzoom = this.$vuetify.breakpoint.mdAndDown ? false : true
			window.iron3d.launch(
				this.currentlang,
				navigation,
				false,
				normalzoom
			)
			if (!self.sound) {
				window.iron3d.setMute(true)
			}
			window.iron3d.playUntilStep(1)
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

			window.iron3d.setPlaybackProgressCallback(progress => {
				// This function gives you the progression on the animation ( 0 to 1 ).
				//if (!self.manualprogress) {
				self.playprogress = progress
				//self.$store.commit('SET_ANIMATIONPROGRESS', progress)
				//}
				//console.log(progress)
			})

			window.iron3d.setBlockingLoadingOverCallback(() => {
				self.animloaded = true
				//console.log('setBlockingLoadingOverCallback')
				//self.$store.commit('TOGGLE_TOUR_MODE')
			})
		}
	},

	beforeDestroy() {
		console.log('beforeDestroy called')
		window.iron3d.destroy()
		this.$store.commit('TOGGLE_ANIMATIONPLAYING', false)
		// Include here estroy call of the animation
	}
}
</script>

<style lang="scss">
.iron3d-controls #up:before,
#iron3d .regulation1.icon:before {
	top: 0;
	left: 0;
}
#iron3d .navigation.play.button {
	&:after {
		display: inline-block;
		font: normal normal normal 24px/1 'Material Design Icons';
		font-size: inherit;
		text-rendering: auto;
		line-height: inherit;
		-webkit-font-smoothing: antialiased;
		content: '\F040A';
		font-size: 1.6em;
	}
	&:hover:after {
		color: #9d1f30;
	}
}

.fill-width {
	width: 100%;
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
.iron3d-controls #top {
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

@keyframes blinker {
	50% {
		opacity: 0;
	}
}
</style>
