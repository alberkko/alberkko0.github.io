<template>
	<div id="subtitles">
		<video id="videoPlayer" ref="videoPlayer" class="video-js"></video>
		<div
			class="sectionstep-cc-desktop"
			v-if="cc_enabled && !toursteptransitioning && $vuetify.breakpoint.mdAndUp"
			:class="cc_enabled == 2 ? 'cc-style-subtitle' : 'cc-style-text'"
		>
			<div v-if="currentcue && cc_enabled == 2" class="cc-cue" v-html="cuetext"></div>
			<!-- <div v-if="cc_enabled == 2" class="cc-cue">
				<span v-for="(item, ind) in cues" :key="ind" :class="item.activeclass">{{ item.text }}</span>
			</div> -->
			<div v-if="cc_enabled == 1" class="cc-full">
				<div
					v-html="
						location.currentnode.steps[tourcurrentstep - 1]
							.cidescription
					"
				></div>
				<div v-html="location.currentnode.steps[tourcurrentstep - 1].fc"></div>
			</div>
		</div>

		<div
			class="sectionstep-cc"
			v-if="cc_enabled && !toursteptransitioning && $vuetify.breakpoint.mdAndDown"
			:class="cc_enabled == 1 ? 'cc-style-subtitle' : 'cc-style-text'"
		>
			<div v-if="currentcue && cc_enabled == 1" class="cc-cue" v-html="cuetext"></div>
			<div v-if="cc_enabled == 2" class="cc-cue">
				<span v-for="(item, ind) in cues" :key="ind" :class="item.activeclass">{{ item.text }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

export default {
	name: 'AnimationSubtitles',
	props: {
		options: {
			type: Object,
			default() {
				return {
					nativeTextTracks: false
					//autoplay: true
				}
			}
		},
		sources: {
			type: Array,
			default() {
				return []
			}
		}
	},
	data() {
		return {
			player: null,
			currentcue: false,
			cuelist: []
		}
	},
	computed: {
		...mapState([
			'paramkey',
			'currentlang',
			'tourmode',
			'tourautoplay',
			'tourcurrentstep',
			'toursteptransitioning',
			'tourstepjump',
			'tourstepplaying',
			'sound',
			'cc_enabled',
			'animationplaying'
		]),
		...mapGetters(['location']),
		cuetext() {
			return this.currentcue != false ? this.currentcue : '...'
		},
		cues() {
			let thecues = []
			this.cuelist.forEach(cue => {
				cue.activeclass =
					cue.text == this.currentcue ? 'active-cue' : ''
				thecues.push(cue)
			})
			return thecues
		}
	},
	mounted() {
		let _this = this
		_this.player = videojs(
			_this.$refs.videoPlayer,
			_this.options,
			function onPlayerReady() {
				//console.log('onPlayerReady', this)
				this.on('ended', () => {
					if (_this.tourcurrentstep != window.iron3d.lastStepIndex) {
						//console.log('ENDED')
						_this.setStepPLayingState(false)
						_this.moveToNextStep()
					} else {
						_this.setStepPLayingState(false)
						window.iron3d.playUntilEnd()
						//_this.moveToNextStep()
					}
				})
				this.on('play', () => {
					//console.log('PLAYING')
					_this.setStepPLayingState(true)
				})
				_this.setsource(_this.tourcurrentstep)
			}
		)
	},
	watch: {
		animationplaying(playing) {
			if (playing && !this.tourstepplaying) {
				this.moveToNextStep()
			}
			/* if (playing && this.tourstepplaying) {
				this.player.play()
			} else {
				this.player.pause()
			} */
		},
		tourcurrentstep(newStep) {
			this.setsource(newStep)
		},
		toursteptransitioning(newVal) {
			if (!newVal) {
				if (this.tourcurrentstep == 1) {
					this.setsource(1)
				}
				this.player.play()
			}
		},
		sound(notMuted) {
			this.player.muted(!notMuted)
		},
		currentlang(newValue) {
			if (typeof window.iron3d != 'undefined') {
				window.iron3d.setLanguage(newValue)
				this.restartPlayer()
			}
		},
		$route(to, from) {
			//Reset player state if navigating to another view
			if (to.params.id != from.params.id) {
				this.resetPlayer()
			}
		}
	},
	methods: {
		...mapActions(['chageTourStep']),
		setsource(step) {
			let _this = this
			_this.currentcue = false
			_this.cuelist = []
			//absorption1-step8.mp3
			let audiopath =
				'./audio/' +
				this.currentlang +
				'/' +
				this.location.currentnode[this.paramkey] +
				'-step' +
				step
			//console.log(audiopath)
			this.clearTextTracks()
			this.player.src({
				type: 'audio/mp3',
				src: audiopath + '.mp3'
			})
			let textTrack = this.player.addRemoteTextTrack({
				kind: 'captions',
				language: this.currentlang,
				label: this.currentlang,
				src: audiopath + '.vtt'
			})
			textTrack.track.mode = 'showing'
			textTrack.addEventListener('load', () => {
				for (let i = 0; i < textTrack.track.cues.length; i++) {
					_this.cuelist.push(textTrack.track.cues[i])
				}
			})
			textTrack.track.addEventListener('cuechange', function() {
				if (textTrack.track.activeCues != null) {
					const cue = textTrack.track.activeCues[0]
					if (cue !== undefined) {
						_this.currentcue = textTrack.track.activeCues[0].text
						//console.log(textTrack.track.activeCues[0].text)
					} else {
						_this.currentcue = false
					}
				} else {
					_this.currentcue = false
				}
			})
			if (!this.toursteptransitioning) {
				this.player.play()
			}
		},
		clearTextTracks() {
			let tracks = this.player.remoteTextTracks()
			for (var i = tracks.length - 1; i >= 0; i--) {
				this.player.removeRemoteTextTrack(tracks[i])
			}
		},
		resetPlayer() {
			this.player.pause()
			this.currentcue = false
			this.cuelist = []
			this.clearTextTracks()
			this.setStepPLayingState(false)
		},
		restartPlayer() {
			this.setsource(1)
			this.toStep(0)
		},
		setStepPLayingState(state) {
			this.$store.commit('TOGGLE_TOUR_STEPPLAYING', state)
		},
		moveToNextStep() {
			if (this.animationplaying) {
				let tourpayload = {
					direction: 'next',
					jump: false
				}
				this.chageTourStep(tourpayload)
			}
		},
		toStep(step) {
			let tourpayload = {
				direction: 'skip',
				jump: true,
				step: step + 1
			}
			this.chageTourStep(tourpayload)
			this.$store.commit('TOGGLE_TOUR_AUTOPLAY', false)
		}
	},
	beforeDestroy() {
		if (this.player) {
			this.player.dispose()
		}
	}
}
</script>

<style lang="scss">
//@import 'video.js/dist/video-js.css';
#subtitles {
	position: absolute;
	z-index: 4;
	bottom: 50px;
	left: 0;
	width: 100%;
	.video-js {
		position: absolute;
		bottom: 300%;
		//width: 700px;
		//height: 500px;
		margin-bottom: 100px;
		left: -1000px;
	}
	.sectionstep-cc {
		position: absolute;
		z-index: 1;
		bottom: 0;
		width: 100%;
		padding: 15px 20px 15px;
		text-align: center;
		color: #ffffff;
		&.cc-style-subtitle {
			.cc-cue {
				display: inline;
				padding: 3px 5px;
				background-color: rgba(0, 0, 0, 0.7);
			}
		}
		&.cc-style-text {
			background-color: rgba(0, 0, 0, 0.3);
			.active-cue {
				background-color: rgba(0, 0, 0, 0.8);
			}
		}
	}

	.sectionstep-cc-desktop {
		position: absolute;
		z-index: 1;
		bottom: 0;
		max-height: 150px;
		overflow-y: scroll;
		width: 100%;
		padding: 15px 20px 15px;
		text-align: center;
		color: #ffffff;
		&.cc-style-subtitle {
			.cc-cue {
				display: inline;
				padding: 3px 5px;
				background-color: rgba(0, 0, 0, 0.7);
			}
		}
		&.cc-style-text {
			background-color: rgba(0, 0, 0, 0.3);
			.active-cue {
				background-color: rgba(0, 0, 0, 0.0);
			}
		}
	}

	.cc-full {
		display: flex;
	}
}
</style>
