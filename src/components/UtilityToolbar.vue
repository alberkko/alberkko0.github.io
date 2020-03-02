<template>
	<div v-if="!tourmode">
		<v-app-bar app flat dense height="50" style="top: 85px" clipped-right color="#fff">
			<!-- toolbar button on homescreen -->
			<ToggleTour></ToggleTour>
			<v-tooltip v-if="homeState" bottom>
				<template v-slot:activator="{ on }">
					<v-btn
						small
						tile
						class="grey lighten-2"
						v-on="on"
						@click="toggleAllPanels"
						:class="allpanels ? 'v-btn--active' : ''"
					>
						<v-icon v-if="!allpanels">mdi-eye-outline</v-icon>
						<v-icon v-if="allpanels">mdi-eye-off-outline</v-icon>
					</v-btn>
				</template>
				<span v-if="!allpanels">{{ $t('show_all') }}</span>
				<span v-if="allpanels">{{ $t('hide_all') }}</span>
			</v-tooltip>

			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn
						small
						tile
						class="grey lighten-2"
						v-on="on"
						@click="toggleQuantities"
						:class="showlabels ? 'v-btn--active' : ''"
					>
						<v-icon>mdi-bottle-wine</v-icon>
					</v-btn>
				</template>
				<span v-if="!showlabels">{{ $t('quantity_on') }}</span>
				<span v-if="showlabels">{{ $t('quantity_off') }}</span>
			</v-tooltip>

			<v-spacer />

			<v-tooltip v-if="enableMinimap" bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn
						small
						tile
						class="grey lighten-2"
						link
						v-on="{ ...tooltip }"
						@click="toggleMinimap"
						:input-value="showminimap"
						:disabled="!enableMinimap"
					>
						<v-icon>mdi-compass</v-icon>
					</v-btn>
				</template>
				<span>{{ $t('minimap') }}</span>
			</v-tooltip>

			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn small tile class="grey lighten-2" link @click="openTablesDialog" v-on="{ ...tooltip }">
						<v-icon>mdi-file-table</v-icon>
					</v-btn>
				</template>
				<span>{{ $t('tableslabel') }}</span>
			</v-tooltip>

			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn
						small
						tile
						class="grey lighten-2"
						link
						v-on="{ ...tooltip }"
						:disabled="!existreferences"
						@click="openReferencesDialog"
					>
						<v-icon>mdi-asterisk</v-icon>
					</v-btn>
				</template>
				<span>{{ $t('referenceslabel') }}</span>
			</v-tooltip>

			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn small tile class="grey lighten-2" link @click="openLegalDialog" v-on="{ ...tooltip }">
						<v-icon>mdi-information-outline</v-icon>
					</v-btn>
				</template>
				<span>{{ $t('legallabel') }}</span>
			</v-tooltip>
		</v-app-bar>
	</div>
</template>


<script>
import ToggleTour from '../components/ToggleTour'
import { mapState } from 'vuex'
import { findIndex } from 'lodash'
import { mapGetters } from 'vuex'
export default {
	name: 'UtilityToolbar',
	components: {
		ToggleTour
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
		...mapGetters(['location', 'enableMinimap', 'homeState']),
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
		openTablesDialog() {
			this.$store.commit('SET_TABLES_DIALOG', true)
		},
		openLegalDialog() {
			this.$store.commit('SET_LEGAL_DIALOG', true)
		},
		openReferencesDialog() {
			this.$store.commit('SET_REFERENCES_DIALOG', true)
		}
	}
}
</script>

<style scoped>
.utility-toolbar {
	top: 185px;
}
</style>