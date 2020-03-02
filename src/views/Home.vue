<template>
	<div class="home left-column-wraper d-flex flex-column">
		<v-list class="pb-0 pt-0">
			<v-list-item :to="{
					name: 'home'
				}" class="section-nav-link" active-class="active">
				<v-list-item-content>
					<v-list-item-title
						class="text-uppercase subtitle-1 font-weight-medium"
					>{{ mainNavigation.name }}</v-list-item-title>
				</v-list-item-content>
				<v-list-item-icon>
					<v-icon>mdi-chevron-right-box-outline</v-icon>
				</v-list-item-icon>
			</v-list-item>
			<v-divider></v-divider>
		</v-list>

		<div class="flex-grow-1 column-panels">
			<v-row justify="center">
				<v-expansion-panels accordion transparent :multiple="allpanels" v-model="panels">
					<v-expansion-panel v-for="item in mainNavigation.childs" :key="item.key">
						<v-expansion-panel-header class="body-2 text-uppercase">{{ item.name }}</v-expansion-panel-header>
						<v-expansion-panel-content class="body-3">
							<div v-html="item.cidescription"></div>
							<v-btn small outlined color="primary" class="mt-3">
								Open
								<v-icon>mdi-chevron-right</v-icon>
							</v-btn>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-row>
		</div>
	</div>
</template>


<script>
import { mapState } from 'vuex'
import { findIndex } from 'lodash'
export default {
	name: 'home',
	components: {
	},
	data: () => ({
		panels: [],
		allpanels: false
	}),
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
	computed: {
		...mapState(['mainNavigation', 'previewpanels', 'showlabels'])
	},
	// methods: {
	// 	toggleAllPanels() {
	// 		if (this.allpanels) {
	// 			//this.allpanels = false
	// 			this.$store.commit('EMPTY_PREVIEW')
	// 		} else {
	// 			//this.allpanels = true
	// 			this.$store.commit('PREVIEW_ALL')
	// 		}
	// 	},
	// 	toggleQuantities() {
	// 		this.$store.commit('TOGGLE_LABELS')
	// 	}
	// }
}
</script>
