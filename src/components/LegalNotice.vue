<template>
	<v-dialog
		v-model="legaldialog"
		transition="dialog-bottom-transition"
		scrollable
		hide-overlay
		max-width="600"
		:persistent="persistdialog"
		no-click-animation
		:fullscreen="$vuetify.breakpoint.mdAndDown"
	>
		<v-card tile class="dialog-content">
			<v-card-title class="pa-0">
				<v-toolbar flat dark dense class="v-sheet-bg">
					<v-toolbar-title>{{ maindata.name }}</v-toolbar-title>
					<v-spacer />
					<v-btn icon dark @click="legaldialog = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
			</v-card-title>
			<v-card-text class="pa-3" style="color: rgba(0, 0, 0, 0.87)">
				<div v-html="maindata.ciextra.fc"></div>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'LegalNotice',
	computed: {
		...mapState(['persistdialog']),
		legaldialog: {
			get() {
				return this.$store.state.legaldialog
			},
			set(val) {
				this.$store.commit('SET_LEGAL_DIALOG', val)
			}
		},
		maindata() {
			var data = {
				name: 'Legal Notice',
				ciextra: {
					fc: ''
				}
			}
			if (
				typeof this.$store.getters.secondaryNavigation.childs !==
				'undefined'
			) {
				data = this.$store.getters.secondaryNavigation.childs[1]
				data.ciextra = this.$store.getters.getCIExtra(data.cid)
			}
			return data
		}
	},
	methods: {}
}
</script>

<style></style>
