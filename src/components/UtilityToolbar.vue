<template>
	<div>
		<v-app-bar
			flat
			dense
			height="50"
			color="rgb(1,2,1,0)"
			absolute
			class="utility-app-bar"
		>
			<!-- <ToggleTour></ToggleTour> -->
			<div v-if="isIMLanding">
				<v-tooltip bottom>
					<template v-slot:activator="{ on: tooltip }">
						<v-btn
							tile
							class="v-utility-btn"
							link
							v-on="{ ...tooltip }"
							@click="$router.push({ name: 'home' })"
						>
							<v-icon color="blue darken-4"
								>mdi-subdirectory-arrow-left
								mdi-rotate-90</v-icon
							>
						</v-btn>
					</template>
					<!-- <span>{{ $t('show_all') }}</span> -->
					<span>{{ $t('back') }}</span>
				</v-tooltip>
			</div>

			<div v-if="!isIMLanding">
				<v-tooltip bottom>
					<template v-slot:activator="{ on: tooltip }">
						<v-btn
							tile
							class="v-utility-btn"
							link
							v-on="{ ...tooltip }"
							@click="$router.push({ name: 'ironmetabolism' })"
						>
							<v-icon color="blue darken-4"
								>mdi-subdirectory-arrow-left
								mdi-rotate-90</v-icon
							>
						</v-btn>
					</template>
					<!-- <span>{{ $t('show_all') }}</span> -->
					<span>{{ $t('back') }}</span>
				</v-tooltip>
			</div>

			<div v-if="!isIMLanding && $vuetify.breakpoint.mdAndDown">
				<v-tooltip bottom>
					<template v-slot:activator="{ on: tooltip }">
						<v-btn
							tile
							class="v-utility-btn"
							link
							v-on="{ ...tooltip }"
							@click="openInformationDialog"
						>
							<v-icon color="blue darken-4"
								>mdi-information-outline</v-icon
							>
						</v-btn>
					</template>
					<!-- <span>{{ $t('show_all') }}</span> -->
					<span>{{ $t('sectioninfolabel') }}</span>
				</v-tooltip>
			</div>

			<div v-if="!isIMLanding && $vuetify.breakpoint.mdAndDown">
				<v-tooltip bottom>
					<template v-slot:activator="{ on: tooltip }">
						<v-btn
							v-if="$vuetify.breakpoint.smAndDown"
							tile
							class="v-utility-btn"
							link
							v-on="{ ...tooltip }"
							@click="toggleElements"
						>
							<v-icon color="blue darken-4"
								>mdi-format-list-bulleted</v-icon
							>
						</v-btn>
						<!-- <v-btn
							v-else
							tile
							class="v-utility-btn"
							link
							v-on="{ ...tooltip }"
							@click="toggleElements()"
						>
							<v-icon color="blue darken-4"
								>mdi-format-list-bulleted</v-icon
							>
						</v-btn> -->
					</template>
					<!-- <span>{{ $t('show_all') }}</span> -->
					<span>{{ $t('sectionelementslabel') }}</span>
				</v-tooltip>
			</div>

			<div v-if="isIMLanding">
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn
							tile
							class="v-utility-btn"
							v-on="on"
							@click="toggleAllPanels"
							:class="allpanels ? 'v-btn--active' : ''"
						>
							<v-icon color="blue darken-4" v-if="!allpanels"
								>mdi-eye-outline</v-icon
							>
							<v-icon color="blue darken-4" v-if="allpanels"
								>mdi-eye-off-outline</v-icon
							>
						</v-btn>
					</template>
					<span v-if="!allpanels">{{ $t('show_all') }}</span>
					<span v-if="allpanels">{{ $t('hide_all') }}</span>
				</v-tooltip>
			</div>

			<div v-if="isIMLanding">
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn
							tile
							class="v-utility-btn"
							v-on="on"
							@click="toggleQuantities"
							:class="showlabels ? 'v-btn--active' : ''"
						>
							<v-icon color="blue darken-4"
								>mdi-bottle-wine</v-icon
							>
						</v-btn>
					</template>
					<span v-if="!showlabels">{{ $t('quantity_on') }}</span>
					<span v-if="showlabels">{{ $t('quantity_off') }}</span>
				</v-tooltip>
			</div>

			<div v-if="!isIMLanding">
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn
							tile
							class="v-utility-btn"
							v-on="on"
							@click="toggleLabels"
							:class="showlabels ? 'v-btn--active' : ''"
						>
							<v-icon color="blue darken-4" v-if="!showlabels"
								>mdi-format-title</v-icon
							>
							<v-icon color="blue darken-4" v-if="showlabels"
								>mdi-format-clear</v-icon
							>
						</v-btn>
					</template>
					<span v-if="!showlabels">{{ $t('labels_on') }}</span>
					<span v-if="showlabels">{{ $t('labels_off') }}</span>
				</v-tooltip>
			</div>

			<v-spacer />

			<div>
				<v-tooltip bottom>
					<template v-slot:activator="{ on: tooltip }">
						<v-btn
							tile
							class="v-utility-btn"
							link
							v-on="{ ...tooltip }"
							:disabled="!existreferences"
							@click="openReferencesDialog"
						>
							<v-icon color="blue darken-4">mdi-asterisk</v-icon>
						</v-btn>
					</template>
					<span>{{ $t('referenceslabel') }}</span>
				</v-tooltip>
			</div>

			<div v-if="enableMinimap">
				<v-tooltip bottom>
					<template v-slot:activator="{ on: tooltip }">
						<v-btn
							tile
							class="v-utility-btn"
							link
							v-on="{ ...tooltip }"
							v-if="$vuetify.breakpoint.smAndDown"
							@click="toggleMinimap(), closeElementsTable()"
							:input-value="showminimap"
							:disabled="!enableMinimap"
						>
							<v-icon color="blue darken-4">mdi-compass</v-icon>
						</v-btn>

						<v-btn
							v-else
							tile
							class="v-utility-btn"
							link
							v-on="{ ...tooltip }"
							@click="toggleMinimap()"
							:input-value="showminimap"
							:disabled="!enableMinimap"
						>
							<v-icon color="blue darken-4">mdi-compass</v-icon>
						</v-btn>
					</template>
					<span>{{ $t('minimap') }}</span>
				</v-tooltip>
			</div>
		</v-app-bar>
	</div>
</template>

<script>
// import ToggleTour from '../components/ToggleTour'
import { mapState } from 'vuex'
import { findIndex } from 'lodash'
import { mapGetters } from 'vuex'
export default {
	name: 'UtilityToolbar',
	components: {
		// ToggleTour
	},
	data: () => ({
		panels: [],
		allpanels: false
	}),
	computed: {
		...mapState([
			'mainNavigation',
			'previewpanels',
			'showlabels',
			'dataloaded',
			'showminimap',
			'tourmode'
		]),
		...mapGetters(['location', 'enableMinimap', 'isIMLanding']),
		rightdrawer() {
			return (
				this.$store.state.rightdrawer &&
				this.$store.state.tourmode == false
			)
		},
		existreferences() {
			let exist = false
			if (
				this.dataloaded &&
				typeof this.location.currentnode.related !== 'undefined' &&
				typeof this.location.currentnode.related['ELI'] !== 'undefined'
			) {
				exist = true
			}
			return exist
		}
	},
	watch: {
		panels(newValue) {
			//console.log('Updating from ' + oldValue + ' to ' + newValue)
			if (this.allpanels) {
				if (this.panels.length < this.mainNavigation.childs.length) {
					let allpanels = []
					for (
						let i = 0;
						i < this.mainNavigation.childs.length;
						i++
					) {
						allpanels.push(i)
					}
					let difference = allpanels.filter(
						x => !this.panels.includes(x)
					)
					this.allpanels = false
					this.panels = difference
				}
			} else {
				if (typeof newValue !== 'undefined') {
					let previewId = this.mainNavigation.childs[newValue].refcode
					this.$store.commit('SET_PREVIEW', previewId)
				} else {
					this.$store.commit('EMPTY_PREVIEW')
				}
			}
		},
		previewpanels(newValue) {
			if (newValue === 'all') {
				//console.log(newValue)
				this.allpanels = true
				let allpanels = []
				for (let i = 0; i < this.mainNavigation.childs.length; i++) {
					allpanels.push(i)
				}
				this.panels = allpanels
			} else {
				this.allpanels = false
				let newindex = findIndex(this.mainNavigation.childs, function(
					o
				) {
					return o.refcode == newValue
				})
				if (newindex > -1) {
					this.panels = newindex
				} else {
					this.panels = undefined
				}
			}
		}
	},
	methods: {
		toggleAllPanels() {
			if (this.allpanels) {
				//this.allpanels = false
				this.$store.commit('EMPTY_PREVIEW')
			} else {
				//this.allpanels = true
				this.$store.commit('PREVIEW_ALL')
			}
		},
		toggleQuantities() {
			this.$store.commit('TOGGLE_LABELS')
		},

		toggleMinimap() {
			this.$store.commit('TOGGLE_MINIMAP')
			this.$emit('CLICK_SOUND')
		},
		closeElementsTable() {
			this.$store.commit('CLOSE_ELEMENTS_TABLE')
		},
		closeMinimap() {
			this.$store.commit('CLOSE_MINIMAP')
		},
		toggleElements() {
			this.closeMinimap()
			this.$store.commit('TOGGLE_ELEMENTS')
		},
		openTablesDialog() {
			this.$store.commit('SET_TABLES_DIALOG', true)
		},
		openLegalDialog() {
			this.$store.commit('SET_LEGAL_DIALOG', true)
		},
		openInformationDialog() {
			this.$store.commit('SET_INFO_DIALOG', true)
		},
		openReferencesDialog() {
			this.$store.commit('SET_REFERENCES_DIALOG', true)
		},
		toggleLabels() {
			this.$store.commit('TOGGLE_LABELS')
		}
	}
}
</script>

<style scoped>
.v-utility-btn {
	border: 1px solid #9d1f30;
	min-width: 0 !important;
	width: 40px !important;
	height: 40px !important;
	top: 10px;
	margin: 4px;
}
</style>
