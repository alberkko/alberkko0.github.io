<template>
	<div id="AnimationPlayerToolbar">
		<div class="progress-bar">
			<v-slider
				v-model="progress"
				track-color="grey"
				always-dirty
				min="0"
				max="100"
				step="0"
				@mousedown="initManualProgress"
				@mouseup="releaseManualProgress"
				height="10"
				hide-details
				readonly
			></v-slider>
		</div>
		<div class="section-steps d-flex justify-center">
			<div class="steps-wrapper d-flex">
				<div
					v-for="(item, ind) in stepsprogress"
					:key="ind"
					class="step-block"
					:style="`left: ${item*100}%`"
				>
					<v-tooltip top>
						<template v-slot:activator="{ on: tooltip }">
							<div
								class="step-marker"
								:class="activeClass(ind)"
								@click="toStep(ind)"
								v-on="{ ...tooltip }"
							>
								<v-icon class="marker-icon">mdi-play</v-icon>
							</div>
						</template>
						<span>{{ ind+1+"/"+ stepsprogress.length}}</span>
					</v-tooltip>
				</div>
			</div>
		</div>
		<v-toolbar dense flat color="grey lighten-3" height="40">
			<v-toolbar-items>
				<v-btn icon :class="animationplaying ? 'active-btn' : ''" @click="togglePlayPause">
					<v-icon v-if="!animationplaying">mdi-play</v-icon>
					<v-icon v-else>mdi-pause</v-icon>
				</v-btn>
				<v-btn v-if="!animationLoading" icon @click="callPrevAnimation">
					<v-icon>mdi-skip-backward</v-icon>
				</v-btn>
				<v-btn v-else disabled icon>
					<v-icon>mdi-skip-backward</v-icon>
				</v-btn>
				<v-btn icon @click="prevStep">
					<v-icon>mdi-skip-previous</v-icon>
				</v-btn>
				<v-btn icon @click="nextStep">
					<v-icon>mdi-skip-next</v-icon>
				</v-btn>
				<v-btn v-if="!animationLoading" icon @click="callNextAnimation">
					<v-icon>mdi-skip-forward</v-icon>
				</v-btn>
				<v-btn v-else disabled icon>
					<v-icon>mdi-skip-forward</v-icon>
				</v-btn>
				<v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn icon @click="toggleSound" v-on="on" :class="!sound ? 'active-btn' : ''">
							<v-icon v-if="sound">mdi-volume-high</v-icon>
							<v-icon v-if="!sound">mdi-volume-off</v-icon>
						</v-btn>
					</template>
					<span v-if="sound">{{ $t('sound_off') }}</span>
					<span v-if="!sound">{{ $t('sound_on') }}</span>
				</v-tooltip>
			</v-toolbar-items>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<v-menu top left offset-y>
					<template v-slot:activator="{ on: menu }">
						<v-tooltip top>
							<template v-slot:activator="{ on: tooltip }">
								<v-btn icon v-on="{ ...tooltip, ...menu }" :class="cc_enabled ? 'active-btn' : ''">
									<v-icon v-if="cc_enabled == 0">mdi-closed-caption-outline</v-icon>
									<v-icon v-if="cc_enabled == 1 && $vuetify.breakpoint.mdAndDown">mdi-closed-caption</v-icon>
									<v-icon v-if="cc_enabled == 2 && $vuetify.breakpoint.mdAndDown">mdi-card-text</v-icon>
									<v-icon v-if="cc_enabled == 1 && $vuetify.breakpoint.mdAndUp">mdi-card-text</v-icon>
									<v-icon v-if="cc_enabled == 2 && $vuetify.breakpoint.mdAndUp">mdi-closed-caption</v-icon>
								</v-btn>
							</template>
							<span v-if="cc_enabled">{{ $t('cc_off') }}</span>
							<span v-if="!cc_enabled">{{ $t('cc_on') }}</span>
						</v-tooltip>
					</template>
					<v-list tile>
						<v-list-item
							v-if="$vuetify.breakpoint.mdAndDown"
							@click="toggleCC(2)"
							:input-value="cc_enabled == 2"
						>
							<v-list-item-icon class="mr-3 active-btn">
								<v-icon>mdi-card-text</v-icon>
							</v-list-item-icon>
							<v-list-item-title>
								{{
								$t('cc_full')
								}}
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							v-if="$vuetify.breakpoint.mdAndDown"
							@click="toggleCC(1)"
							:input-value="cc_enabled == 1"
						>
							<v-list-item-icon class="mr-3 active-btn">
								<v-icon>mdi-closed-caption</v-icon>
							</v-list-item-icon>
							<v-list-item-title>
								{{
								$t('cc_on')
								}}
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							v-if="$vuetify.breakpoint.mdAndUp"
							@click="toggleCC(1)"
							:input-value="cc_enabled == 1"
						>
							<v-list-item-icon class="mr-3 active-btn">
								<v-icon>mdi-card-text</v-icon>
							</v-list-item-icon>
							<v-list-item-title>
								{{
								$t('cc_full')
								}}
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							v-if="$vuetify.breakpoint.mdAndUp"
							@click="toggleCC(2)"
							:input-value="cc_enabled == 2"
						>
							<v-list-item-icon class="mr-3 active-btn">
								<v-icon>mdi-closed-caption</v-icon>
							</v-list-item-icon>
							<v-list-item-title>
								{{
								$t('cc_on')
								}}
							</v-list-item-title>
						</v-list-item>

						<v-list-item @click="toggleCC(0)" :input-value="cc_enabled == 0">
							<v-list-item-icon class="mr-3">
								<v-icon>mdi-closed-caption-outline</v-icon>
							</v-list-item-icon>
							<v-list-item-title>
								{{
								$t('cc_off')
								}}
							</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
				<!-- <v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn
							icon
							v-on="on"
							@click="toggleCC"
							:class="cc_enabled ? 'active-btn' : ''"
						>
							<v-icon>mdi-closed-caption</v-icon>
						</v-btn>
					</template>
					<span v-if="cc_enabled">{{ $t('cc_off') }}</span>
					<span v-if="!cc_enabled">{{ $t('cc_on') }}</span>
				</v-tooltip>-->
				<v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn light icon v-on="on" @click="saveScreenshot" :disabled="savescr == 1" active-class>
							<v-icon>mdi-camera-outline</v-icon>
						</v-btn>
					</template>
					<span v-if="savescr == 0">{{ $t('screenshot') }}</span>
					<span v-if="savescr == 1">{{ $t('screenshot') }}</span>
					<span v-if="savescr == 2">{{ $t('screenshot') }}</span>
				</v-tooltip>
				<v-tooltip top v-if="$vuetify.breakpoint.lgAndUp">
					<template v-slot:activator="{ on }">
						<v-btn
							light
							icon
							@click="toggleFullscreen"
							v-on="on"
							:class="isfullscreen ? 'v-btn--active' : ''"
						>
							<v-icon v-if="!isfullscreen">mdi-fullscreen</v-icon>
							<v-icon v-if="isfullscreen">mdi-fullscreen-exit</v-icon>
						</v-btn>
					</template>
					<span v-if="!isfullscreen">{{ $t('fullscreen_on') }}</span>
					<span v-if="isfullscreen">{{ $t('fullscreen_off') }}</span>
				</v-tooltip>
			</v-toolbar-items>
		</v-toolbar>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
export default {
	name: 'AnimationPlayerToolbar',
	props: {
		playprogress: Number,
		stepsprogress: Array
	},
	data: () => ({
		isHidden: true
	}),
	computed: {
		...mapState([
			'navigation',
			'paramkey',
			'dataloaded',
			'isfullscreen',
			'sound',
			'cc_enabled',
			'animationplaying',
			'animationLoading',
			'manualprogress',
			'animationprogress',
			'savescr',
			'navtransitioning',
			'tourmode',
			'tourautoplay',
			'tourlist',
			'tourcurrentstep',
			'toursteptransitioning',
			'tourstepplaying'
		]),
		...mapGetters(['location', 'isSection', 'isIMLanding']),
		progress: {
			get: function() {
				//console.log(this.playprogress)
				return this.playprogress * 100
			},
			set: function(progress) {
				//if (this.manualprogress) {
				//this.$store.commit('SET_ANIMATIONPROGRESS', progress / 100)
				this.changeprogress(progress)
				//}
			}
		}
	},
	methods: {
		...mapActions(['chageTourStep']),
		toggleFullscreen() {
			this.$root.toggleFullscreen()
		},
		saveScreenshot() {
			//this.$root.saveScreenshot()
			let _this = this
			setTimeout(function() {
				_this.$store.commit('SET_SCR', 1)
			}, 1000)
		},
		toggleSound() {
			this.$store.commit('TOGGLE_SOUND')
		},
		toggleCC(val) {
			this.$store.commit('TOGGLE_CC', val)
		},
		togglePlayPause() {
			this.$store.commit('TOGGLE_ANIMATIONPLAYING')
			//this.$emit('toggle-playpause')
		},
		callPrevAnimation() {
			this.$emit('prev-animation')
		},
		callNextAnimation() {
			this.$emit('next-animation')
			this.$store.commit('TOGGLE_ANIMATIONLOADING', true)
		},
		prevStep(jump) {
			let tourpayload = {
				direction: 'prev',
				jump: jump
			}

			this.chageTourStep(tourpayload)
			this.$store.commit('TOGGLE_TOUR_AUTOPLAY', false)
			/* if (this.animationplaying) {
				this.$store.commit('TOGGLE_ANIMATIONPLAYING', false)
			} */
		},
		nextStep(jump) {
			let tourpayload = {
				direction: 'next',
				jump: jump
			}
			this.chageTourStep(tourpayload)
			this.$store.commit('TOGGLE_TOUR_AUTOPLAY', false)
			/* if (this.animationplaying) {
				this.$store.commit('TOGGLE_ANIMATIONPLAYING', false)
			} */
		},
		toStep(step) {
			let tourpayload = {
				direction: 'skip',
				jump: true,
				step: step + 1
			}
			this.chageTourStep(tourpayload)
			this.$store.commit('TOGGLE_TOUR_AUTOPLAY', false)
			/* if (this.animationplaying) {
				this.$store.commit('TOGGLE_ANIMATIONPLAYING', false)
			} */
		},
		activeClass(ind) {
			//let currentclass = 'grey lighten-2'
			let currentclass = ''
			let currentind = ind + 1
			if (
				this.tourcurrentstep > currentind ||
				(this.tourcurrentstep == currentind &&
					!this.toursteptransitioning)
			) {
				currentclass = 'done-step '
			}
			if (
				this.tourcurrentstep == currentind &&
				!this.toursteptransitioning
			) {
				currentclass += ' current-step'
			}
			return currentclass
		},
		initManualProgress() {
			this.$store.commit('SET_MANUAL_PROGRESS', true)
		},
		releaseManualProgress() {
			this.$store.commit('SET_MANUAL_PROGRESS', false)
		},
		changeprogress(progress) {
			if (this.manualprogress) {
				this.$emit('seek', progress / 100)
			}
		}
	}
}
</script>

<style lang="scss">
.active-btn {
	&,
	.v-icon {
		color: #9d1f30 !important;
	}
}
#AnimationPlayerToolbar {
	position: absolute;
	z-index: 1;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #e0e0e0;
	background-image: linear-gradient(180deg, #f0f0f0, #d0d0d0);
	border-top: 1px solid #d0d0d0 !important;
	.v-toolbar__content {
		padding: 0;
	}
	.v-btn {
		&.v-btn--icon {
			color: rgba(0, 0, 0, 1);
		}
		.v-icon {
			font-size: 28px;
		}
	}
	.section-steps {
		position: absolute;
		z-index: 2;
		top: 0px;
		width: 100%;
		height: 0px;
		//background-color: rgba(0, 0, 0, 0.2);
		.steps-wrapper {
			width: 100%;
			.step-block {
				position: relative;
				.step-marker {
					width: 10px;
					cursor: pointer;
					position: absolute;
					bottom: 0;
					height: 10px;
					left: 50%;
					transform: translateX(-50%);
					//background-color: #e0e0e0;
					&:after {
						content: ' ';
						display: block;
						position: absolute;
						width: 2px;
						height: 100%;
						background-color: white;
						left: 4px;
					}
					&.done-step {
						&:after {
							background-color: #ff9800;
						}
					}
					.marker-icon {
						position: absolute;
						top: -20px;
						left: -7px;
						transform: rotate(90deg);
						display: none;
					}
					&.current-step {
						.marker-icon {
							display: flex;
						}
					}
					&.current-step:after,
					&:hover {
						background-color: #ff9800 !important;
						color: #ff9800 !important;
					}
				}
			}
		}
	}
	.progress-bar {
		position: absolute;
		top: -10px;
		left: 0;
		width: 100%;
		z-index: 1;
		height: 10px;
		// .theme--light.v-slider .v-slider__track-background, .theme--light.v-slider .v-slider__track-fill, .theme--light.v-slider .v-slider__thumb{
		// 	background: rgba(255, 0, 0, 2.26);
		// }
		.v-slider {
			margin: 0;
		}
		.v-input__slot {
			margin-bottom: 0;
		}
		.v-slider__track-container {
			height: 10px;
			:first-child {
				background-color: #000000 !important;
				opacity: 0.5;
			}
			:nth-child(2) {
				opacity: 0.8;
			}
		}
		.v-slider__thumb {
			display: none;
		}
		&:hover {
			.v-slider__thumb {
				display: block;
			}
		}
	}
}
</style>
