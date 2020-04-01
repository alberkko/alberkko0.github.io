<template>
	<div class="scroll">
		<v-card tile class="dialog-content mt-auto">
			<v-card-title class="pa-0">
				<v-toolbar flat dark class="v-sheet-bg">
					<v-toolbar-title>{{ maindata.name }}</v-toolbar-title>
				</v-toolbar>
			</v-card-title>
			<v-card-text class="py-5">
				<div v-html="maindata.ciextra.fc"></div>
			</v-card-text>
		</v-card>
	</div>
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
				data = this.$store.getters.secondaryNavigation.childs[0]
				data.ciextra = this.$store.getters.getCIExtra(data.cid)
			}
			return data
		}
	},
	methods: {}
}
</script>

<style lang="scss" scoped>
.scroll {
	height: 100vh;
	overflow-y: scroll;
	overflow-x: hidden;
	display: flex;
	justify-content: center;
	align-content: center;
}

.dialog-content {
	top:150px;
	width: 65%;
	margin-bottom: 270px !important;
}

@media only screen and (max-width: 768px) {
	.dialog-content {
		width: 90%;
		margin-bottom: 270px !important;
	}
}
</style>
