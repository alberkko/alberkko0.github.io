<template>
	<div id="tour-panel" class="d-none" v-if="tourmode && !navtransitioning">
		<v-fade-transition v-if="$vuetify.breakpoint.lgAndUp">
			<v-card elevation="15" outlined tile>
				<v-card-title
					dark
					class="subtitle-2 pb-1 pt-2 px-2 panel-title"
				>
					<span>{{ $t('tourpanel_title') }}</span>
					<v-spacer />
					<v-btn
						small
						tile
						depressed
						color="red darken-2"
						class="close-tour-btn"
						dark
						@click="stopTour"
					>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text class="pa-0">
					<div class="d-flex step-prg">
						<span
							v-for="(item, ind) in location.currentnode.steps"
							:key="ind"
							class="flex-grow-1 step-prg-item"
							:class="activeClass(ind)"
						></span>
					</div>
				</v-card-text>
				<v-card-text class="pa-0">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								small
								tile
								depressed
								block
								:color="tourautoplay ? 'primary' : ''"
								:dark="tourautoplay"
								:outlined="!tourautoplay"
								@click="toggleAutoplay"
								class="step-btn autoplay-btn"
								v-on="on"
							>
								<span>
									<v-icon>mdi-chevron-right</v-icon>
									<v-icon style="margin-left:-22.5px;"
										>mdi-chevron-right</v-icon
									>
									<v-icon style="margin-left:-22.5px;"
										>mdi-chevron-right</v-icon
									>
								</span>
								<span style="margin-left: -12px;">
									<v-icon>mdi-chevron-right</v-icon>
									<v-icon style="margin-left:-22.5px;"
										>mdi-chevron-right</v-icon
									>
									<v-icon style="margin-left:-22.5px;"
										>mdi-chevron-right</v-icon
									>
								</span>
								<span style="margin-left: -12px;">
									<v-icon>mdi-chevron-right</v-icon>
									<v-icon style="margin-left:-22.5px;"
										>mdi-chevron-right</v-icon
									>
									<v-icon style="margin-left:-22.5px;"
										>mdi-chevron-right</v-icon
									>
								</span>
							</v-btn>
						</template>
						<span v-if="tourautoplay">
							{{ $t('tourpanel_autoplay_off') }}
						</span>
						<span v-if="!tourautoplay">
							{{ $t('tourpanel_autoplay_on') }}
						</span>
					</v-tooltip>
				</v-card-text>
				<v-card-actions v-if="!tourautoplay" class="pa-0">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								small
								tile
								depressed
								outlined
								class="ma-0 step-btn prev-step-btn"
								@click="prevStep(true)"
								v-on="on"
							>
								<v-icon>mdi-skip-previous</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('tourpanel_prev') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								small
								tile
								depressed
								outlined
								class="ma-0 flex-grow-1 step-btn play-step-btn"
								style="margin-left: -1px !important;"
								:disabled="toursteptransitioning"
								@click="nextStep(false)"
								v-on="on"
							>
								<v-icon>mdi-play</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('tourpanel_play') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								small
								tile
								depressed
								outlined
								class="ma-0 step-btn step-btn next-step-btn"
								style="margin-left: -1px !important;"
								@click="nextStep(true)"
								v-on="on"
							>
								<v-icon>mdi-skip-next</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('tourpanel_next') }}</span>
					</v-tooltip>
				</v-card-actions>
				<v-fade-transition group>
					<v-card-title
						dark
						class="subtitle-2 pt-2 pb-1 px-2 panel-title text-uppercase flex-nowrap"
						v-if="!toursteptransitioning"
						key="stepinfo-title"
					>
						<span class="text-truncate flex-grow-1">
							{{ location.currentnode.name }}
						</span>
						<span
							class="flex-grow-0 pl-2"
							style="white-space: nowrap"
						>
							{{ tourcurrentstep }}/{{
								location.currentnode.steps.length
							}}
						</span>
					</v-card-title>
					<v-divider
						v-if="!toursteptransitioning"
						key="stepinfo-divider"
					></v-divider>
					<v-card-text
						class="pa-2"
						v-if="!toursteptransitioning"
						key="stepinfo-text"
					>
						<div
							v-html="
								location.currentnode.steps[tourcurrentstep - 1]
									.cidescription
							"
						></div>
						<div
							v-html="
								location.currentnode.steps[tourcurrentstep - 1]
									.fc
							"
						></div>
					</v-card-text>
				</v-fade-transition>
			</v-card>
		</v-fade-transition>
		<v-fade-transition v-if="$vuetify.breakpoint.mdAndDown">
			<div class="tour-panel-sm">
				<v-card-text
					class="pa-2 white"
					v-if="!toursteptransitioning"
					key="stepinfo-text"
				>
					<div
						v-html="
							location.currentnode.steps[tourcurrentstep - 1]
								.cidescription
						"
					></div>
					<div
						v-html="
							location.currentnode.steps[tourcurrentstep - 1].fc
						"
					></div>
				</v-card-text>
				<div class="d-flex step-prg">
					<span
						v-for="(item, ind) in location.currentnode.steps"
						:key="ind"
						class="flex-grow-1 step-prg-item"
						:class="activeClass(ind)"
					></span>
				</div>
				<div class="d-flex">
					<v-btn
						tile
						small
						depressed
						color="red darken-2"
						dark
						@click="stopTour"
					>
						<v-icon>mdi-close</v-icon>
					</v-btn>
					<v-btn
						small
						tile
						depressed
						:color="tourautoplay ? 'primary' : ''"
						:dark="tourautoplay"
						:outlined="!tourautoplay"
						@click="toggleAutoplay"
						class="step-btn autoplay-btn"
					>
						<span>
							<v-icon>mdi-chevron-right</v-icon>
							<v-icon style="margin-left:-22.5px;"
								>mdi-chevron-right</v-icon
							>
							<v-icon style="margin-left:-22.5px;"
								>mdi-chevron-right</v-icon
							>
						</span>
						<span style="margin-left: -12px;">
							<v-icon>mdi-chevron-right</v-icon>
							<v-icon style="margin-left:-22.5px;"
								>mdi-chevron-right</v-icon
							>
							<v-icon style="margin-left:-22.5px;"
								>mdi-chevron-right</v-icon
							>
						</span>
						<span style="margin-left: -12px;">
							<v-icon>mdi-chevron-right</v-icon>
							<v-icon style="margin-left:-22.5px;"
								>mdi-chevron-right</v-icon
							>
							<v-icon style="margin-left:-22.5px;"
								>mdi-chevron-right</v-icon
							>
						</span>
					</v-btn>
					<v-btn
						small
						tile
						depressed
						outlined
						class="ma-0 step-btn prev-step-btn"
						:disabled="tourautoplay"
						@click="prevStep(true)"
					>
						<v-icon>mdi-skip-previous</v-icon>
					</v-btn>
					<v-btn
						small
						tile
						depressed
						outlined
						class="ma-0 flex-grow-1 step-btn play-step-btn"
						style="margin-left: -1px !important;"
						:disabled="toursteptransitioning || tourautoplay"
						@click="nextStep(false)"
					>
						<v-icon>mdi-play</v-icon>
					</v-btn>
					<v-btn
						small
						tile
						depressed
						outlined
						class="ma-0 step-btn step-btn next-step-btn"
						style="margin-left: -1px !important;"
						:disabled="tourautoplay"
						@click="nextStep(true)"
					>
						<v-icon>mdi-skip-next</v-icon>
					</v-btn>
				</div>
			</div>
		</v-fade-transition>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
export default {
	name: 'TourPanel',
	data: () => ({
		currentstep: 1
	}),
	computed: {
		...mapState([
			'navtransitioning',
			'tourmode',
			'tourautoplay',
			'tourlist',
			'tourcurrentstep',
			'toursteptransitioning'
		]),
		...mapGetters(['location'])
	},
	methods: {
		...mapActions(['chageTourStep']),
		stopTour() {
			this.$store.commit('TOGGLE_TOUR_MODE')
		},
		toggleAutoplay() {
			this.$store.commit('TOGGLE_TOUR_AUTOPLAY')
		},
		activeClass(ind) {
			let currentclass = 'grey lighten-2'
			let currentind = ind + 1
			if (this.tourcurrentstep >= currentind) {
				currentclass = 'orange '
			}
			return currentclass
		},
		prevStep(jump) {
			let direction = 'prev'
			this.chageTourStep({ direction, jump })
			//this.$store.dispatch('chageTourStep', 'prev', jump)
		},
		nextStep(jump) {
			let direction = 'next'
			this.chageTourStep({ direction, jump })
			//this.$store.dispatch('chageTourStep', 'prev', jump)
		}
	}
}
</script>

<style lang="scss">
$tourpanel-border-color: rgba(0, 0, 0, 0.418);
#tour-panel {
	position: absolute;
	top: 144px;
	left: 332px;
	width: 300px;
	z-index: 1;
	.panel-title {
		position: relative;
	}
	.v-card {
		border-color: $tourpanel-border-color;
	}
	.close-tour-btn {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0px;
		height: auto !important;
	}
	.step-btn {
		border-color: $tourpanel-border-color;
	}
	.autoplay-btn {
		border-width: 0;
	}
	.prev-step-btn {
		border-left-width: 0;
	}
	.next-step-btn {
		border-right-width: 0;
	}
	.step-prg {
		background-color: $tourpanel-border-color;
		border-top: 1px solid $tourpanel-border-color;
		border-bottom: 1px solid $tourpanel-border-color;
		.step-prg-item {
			height: 8px;
			&:not(:last-child) {
				margin-right: 1px;
				border-right: 1px solid $tourpanel-border-color;
			}
		}
	}
	.tour-panel-sm {
		position: fixed;
		bottom: 0;
		//height: 31px;
		left: 0;
		width: 100%;
		background-color: #e0e0e0;
		background-image: linear-gradient(180deg, #d0d0d0, #f0f0f0);
		.step-prg {
			bottom: 100%;
			position: absolute;
			width: 100%;
		}
		.autoplay-btn {
			border-width: 1px;
		}
	}
}
</style>
