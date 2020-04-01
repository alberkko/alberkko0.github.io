<template>
	<v-dialog
		v-model="infodialog"
		transition="dialog-bottom-transition"
		scrollable
		hide-overlay
		max-width="600"
		:persistent="persistdialog"
		no-click-animation
	>
		<v-card tile class="dialog-content">
			<v-card-title class="pa-0">
				<v-toolbar flat dark dense class="v-sheet-bg">
					<v-toolbar-title>{{
						$t('sectioninfolabel')
					}}</v-toolbar-title>
					<v-spacer />
					<v-btn icon dark @click="infodialog = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
			</v-card-title>
			<v-card-text class="pa-3" style="color: rgba(0, 0, 0, 0.87)">
				<div v-html="location.currentnode.cidescription"></div>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
	name: 'InformationDialog',
	computed: {
		...mapState(['persistdialog']),
		...mapGetters(['location']),
		infodialog: {
			get() {
				return this.$store.state.infodialog
			},
			set(val) {
				this.$store.commit('SET_INFO_DIALOG', val)
			}
		}
	},
	methods: {}
}
</script>

<style></style>
