<template>
	<v-navigation-drawer
		:value="rightdrawer"
		@input="setRightDrawer($event)"
		mini-variant-width="50"
		app
		clipped
		right
		mini-variant
		dark
		dense
		id="right-column"
	>
	<div class="d-flex flex-column justify-space-between" style="height:100%;">
			<v-list>
				<v-tooltip left>
					<template v-slot:activator="{ on: tooltip }">
						<v-list-item
							link
							v-on="{ ...tooltip }"
							@click="toggleMinimap"
							:input-value="showminimap"
							:disabled="!enableMinimap"
						>
							<v-list-item-icon>
								<v-icon>mdi-compass</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>
									{{
									$t('minimap')
									}}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</template>
					<span>{{ $t('minimap') }}</span>
				</v-tooltip>
				<v-tooltip left>
					<template v-slot:activator="{ on: tooltip }">
						<v-list-item link @click="openTablesDialog" v-on="{ ...tooltip }">
							<v-list-item-icon>
								<v-icon>mdi-file-table</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>
									{{
									$t('tableslabel')
									}}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</template>
					<span>{{ $t('tableslabel') }}</span>
				</v-tooltip>
				<v-tooltip left>
					<template v-slot:activator="{ on: tooltip }">
						<v-list-item
							link
							v-on="{ ...tooltip }"
							:disabled="!existreferences"
							@click="openReferencesDialog"
						>
							<v-list-item-icon>
								<v-icon>mdi-asterisk</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>{{ $t('referenceslabel') }}</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</template>
					<span>{{ $t('referenceslabel') }}</span>
				</v-tooltip>
			</v-list>
			<v-spacer />
			<v-list class="pb-0">
				<v-tooltip left top>
					<template v-slot:activator="{ on: tooltip }">
						<v-list-item link @click="openLegalDialog" v-on="{ ...tooltip }">
							<v-list-item-icon>
								<v-icon>mdi-information-outline</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>
									{{
									$t('legallabel')
									}}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-divider></v-divider>
					</template>
					<span>{{ $t('legallabel') }}</span>
				</v-tooltip>
			</v-list>
		</div>
	</v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
	name: 'RightRegion',
	data: () => ({}),
	computed: {
		...mapState(['dataloaded', 'showminimap']),
		...mapGetters(['location', 'enableMinimap']),
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
	mounted() {
		if (this.$vuetify.breakpoint.lgAndUp) {
			this.$store.commit('SET_RIGHT_DRAWER', true)
		}
	},
	methods: {
		setRightDrawer(val) {
			if (!this.$vuetify.breakpoint.lgAndUp) {
				this.$store.commit('SET_RIGHT_DRAWER', val)
			}
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

<style scoped lang="scss">
#right-column {
	background-color: #838383;
	.v-list {
		background-color: transparent;
	}
}
.v-list-item__icon {
	margin-right: 0 !important;
}
.v-list-item--disabled {
	opacity: 0.5;
}
</style>
