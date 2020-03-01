<template>
	<div>
		<v-dialog
			v-model="referencesdialog"
			transition="dialog-bottom-transition"
			scrollable
			hide-overlay
			max-width="600"
			:persistent="persistdialog"
			no-click-animation
		>
			<v-card tile>
				<v-card-title class="pa-0 v-sheet-bg">
					<v-toolbar flat dark dense class="v-sheet-bg">
						<v-toolbar-title>
							{{
							$t('referenceslabel')
							}}
						</v-toolbar-title>
						<v-spacer />
						<v-btn icon dark @click="referencesdialog = false">
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</v-toolbar>
				</v-card-title>
				<v-card-text class="pa-0">
					<v-list class="pa-0">
						<template v-for="(item, ind) in referencelist">
							<v-list-item two-line :key="ind" :href="item.external_link" target="_blank">
								<v-list-item-content>
									<span class="font-weight-bold">
										{{
										item.cititle
										}}
									</span>
									{{ item.cidescription }}
								</v-list-item-content>
								<v-list-item-action>
									<v-icon color="primary">mdi-open-in-new</v-icon>
								</v-list-item-action>
							</v-list-item>
							<v-divider v-if="ind + 1 < referencelist.length" :key="item.cid"></v-divider>
						</template>
					</v-list>
				</v-card-text>
			</v-card>
		</v-dialog>
		<div id="footer-references" v-if="savescr != 0">
			<span class="text-uppercase">{{ $t('referenceslabel') }}:</span>
			<template v-for="(item, ind) in referencelist">
				<span :key="ind">{{ item.cititle }} {{ item.cidescription }}</span>
				<span :key="item.cid" v-if="ind + 1 < referencelist.length">&nbsp;|&nbsp;</span>
			</template>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
	name: 'Referenes',
	computed: {
		...mapState(['dataloaded', 'savescr', 'persistdialog']),
		...mapGetters(['location']),
		referencesdialog: {
			get() {
				return this.$store.state.referencesdialog
			},
			set(val) {
				this.$store.commit('SET_REFERENCES_DIALOG', val)
			}
		},
		referencelist() {
			var list = []
			if (
				this.dataloaded &&
				typeof this.location.currentnode.related !== 'undefined' &&
				typeof this.location.currentnode.related['ELI'] !== 'undefined'
			) {
				this.location.currentnode.related['ELI'].forEach(item => {
					list.push(this.$store.getters.getCIExtra(item))
				})
			}
			return list
		}
	},
	methods: {}
}
</script>

<style lang="scss">
#footer-references {
	border-top: 10px solid #666666;
	position: fixed;
	top: 100%;
	left: 0;
	width: 100%;
	background: #ffffff;
	z-index: 10;
	font-size: 10px;
}
</style>
