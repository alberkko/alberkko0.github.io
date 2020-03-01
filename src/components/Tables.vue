<template>
	<v-dialog
		v-model="tablesdialog"
		transition="dialog-bottom-transition"
		hide-overlay
		scrollable
		max-width="800"
		:persistent="persistdialog"
		no-click-animation
		:fullscreen="$vuetify.breakpoint.mdAndDown"
	>
		<v-card id="tablesdialog" class="dialog-content" tile>
			<v-card-title class="pa-0">
				<v-toolbar flat dark dense class="v-sheet-bg">
					<v-toolbar-title>{{ maindata.name }}</v-toolbar-title>
					<v-spacer />
					<v-btn icon dark @click="tablesdialog = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
			</v-card-title>
			<v-card-text class="px-3 pb-0">
				<v-row justify="center">
					<v-expansion-panels class="grey lighten-2" accordion hover>
						<v-expansion-panel v-for="(item, ind) in tablesdata" :key="item.cid" :index="ind">
							<v-expansion-panel-header ripple>{{ item.cititle }}</v-expansion-panel-header>
							<v-expansion-panel-content>
								<div v-html="item.fc"></div>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-row>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'Tables',
	data: () => ({
		openitem: undefined,
		clonedopenitem: undefined
	}),
	computed: {
		...mapState(['savescr', 'persistdialog']),
		tablesdialog: {
			get() {
				return this.$store.state.tablesdialog
			},
			set(val) {
				this.$store.commit('SET_TABLES_DIALOG', val)
			}
		},
		maindata() {
			var data = {
				name: 'Tables',
				childs: [],
				documentsinside: {
					LI: []
				}
			}
			if (
				typeof this.$store.getters.secondaryNavigation.childs !==
				'undefined'
			) {
				data = this.$store.getters.secondaryNavigation.childs[0]
			}
			return data
		},
		tablesdata() {
			var itemsfound = []
			this.maindata.documentsinside.LI.forEach(id => {
				var item = this.$store.getters.getCIExtra(id)
				if (item) {
					itemsfound.push(item)
				}
			})
			return itemsfound
		}
	},
	methods: {}
}
</script>

<style lang="scss">
#tablesdialog {
	table {
		td {
			line-height: 1rem !important;
			padding: 5px;
		}
	}
	.responsive-table {
		overflow-x: auto;
	}
}
</style>
