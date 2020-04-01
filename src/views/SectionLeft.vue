<template>
	<div class="section left-column-wraper d-flex flex-column">
		<v-list class="pb-0 pt-0 section-nav">
			<v-list-item
				:to="{
					name: 'section',
					params: { id: location.navmainid }
				}"
				class="section-nav-link"
				active-class="active"
			>
				<v-list-item-content>
					<v-list-item-title
						class="text-uppercase subtitle-1 font-weight-medium"
						>{{ location.navmaintitle }}</v-list-item-title
					>
				</v-list-item-content>
				<v-list-item-icon>
					<v-icon class="inactive-icon">mdi-chevron-right-box</v-icon>
					<v-icon class="active-icon"
						>mdi-chevron-right-box-outline</v-icon
					>
				</v-list-item-icon>
			</v-list-item>
			<v-divider></v-divider>
		</v-list>
		<v-list
			class="py-0 section-nav"
			v-if="location.subnavigation.length"
			dense
		>
			<template v-for="(item, i) in location.subnavigation">
				<v-list-item
					:key="item.cid"
					:to="{
						name: 'section',
						params: { id: item[paramkey] }
					}"
					class="section-nav-link"
					active-class="active"
				>
					<v-list-item-content class="text-uppercase caption">
						<div class="d-flex">
							<span style="padding-right:5px;">&bull;</span>
							{{ item.name }}
						</div>
					</v-list-item-content>
					<v-list-item-icon>
						<v-icon class="inactive-icon"
							>mdi-chevron-right-box</v-icon
						>
						<v-icon class="active-icon"
							>mdi-chevron-right-box-outline</v-icon
						>
					</v-list-item-icon>
				</v-list-item>
				<v-divider :key="i"></v-divider>
			</template>
		</v-list>
		<div id="section-columns-panel" class="flex-grow-1 column-panels">
			<v-row justify="center">
				<v-expansion-panels v-model="panel" multiple accordion>
					<v-expansion-panel>
						<v-expansion-panel-header
							class="caption text-uppercase"
							>{{
								$t('sectioninfolabel')
							}}</v-expansion-panel-header
						>
						<v-expansion-panel-content class="body-3">
							<div
								v-html="location.currentnode.cidescription"
							></div>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel class="mt-0" v-if="elements.length">
						<v-expansion-panel-header
							class="caption text-uppercase"
							>{{
								$t('sectionelementslabel')
							}}</v-expansion-panel-header
						>
						<v-expansion-panel-content class="elements-list">
							<v-item-group v-model="selectedel">
								<v-row no-gutters>
									<v-col
										v-for="(item, i) in elements"
										:key="i"
										cols="2"
									>
										<v-item
											v-slot:default="{ active, toggle }"
										>
											<v-tooltip bottom>
												<template
													v-slot:activator="{ on }"
												>
													<v-img
														v-on="on"
														:src="item.imageSm"
														aspect-ratio="1"
														style="cursor:pointer;"
														class="ma-1 element-thumb"
														:class="
															active
																? 'element-thumb active'
																: 'element-thumb'
														"
														@click="toggle"
														:alt="item.cititle"
													>
														<template
															v-slot:placeholder
														>
															<v-row
																class="fill-height ma-0"
																align="center"
																justify="center"
															>
																<v-progress-circular
																	indeterminate
																	color="grey lighten-1"
																></v-progress-circular>
															</v-row>
														</template>
													</v-img>
												</template>
												<span>{{ item.cititle }}</span>
											</v-tooltip>
										</v-item>
									</v-col>
								</v-row>
							</v-item-group>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel
						id="element-details"
						class="mt-0"
						v-if="element"
					>
						<v-expansion-panel-header
							class="caption text-uppercase"
							>{{
								$t('sectiondesclabel')
							}}</v-expansion-panel-header
						>
						<v-expansion-panel-content class="body-3">
							<div class="font-weight-medium subtitle-1">
								{{ element.cititle }}
							</div>
							<v-img
								v-if="element.imageBg"
								:src="element.imageBg"
								height="100"
								aspect-ratio="1"
								contain
							>
								<template v-slot:placeholder>
									<v-row
										class="fill-height ma-0"
										align="center"
										justify="center"
									>
										<v-progress-circular
											indeterminate
											color="grey lighten-1"
										></v-progress-circular>
									</v-row>
								</template>
							</v-img>
							<div class="font-weight-medium">
								{{ element.cidescription }}
							</div>
							<div v-html="element.fc"></div>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-row>
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { findIndex } from 'lodash'
export default {
	name: 'SectionLeft',
	components: {},
	data: () => ({
		panel: [0, 1, 2],
		selectedel: undefined
	}),
	watch: {
		$route() {
			this.selectRouteElement()
		},
		selectedel() {
			this.setElementRoute()
		},
		dataloaded(loaded) {
			if (loaded) {
				this.selectRouteElement()
			}
		}
	},
	computed: {
		...mapState([
			'paramkey',
			'showlabels',
			'dataloaded',
			'selectedElement',
			'assets',
			'route'
		]),
		...mapGetters(['location']),
		elements() {
			let elements = []
			let self = this
			if (
				this.dataloaded &&
				typeof this.location.currentnode.related['IME'] !== 'undefined'
			) {
				this.location.currentnode.related['IME'].forEach(item => {
					let element = this.$store.getters.getCIExtra(item)
					if (element.imageSm_id != '') {
						element.imageSm =
							self.assets[element.imageSm_id].asset_fileurl
					} else {
						element.imageSm = false
					}
					if (element.imageBg_id != '' && element.imageBg_id != '0') {
						element.imageBg =
							self.assets[element.imageBg_id].asset_fileurl
					} else {
						element.imageBg = false
					}
					elements.push(this.$store.getters.getCIExtra(item))
				})
			}
			return elements
		},
		element() {
			let cidata = false
			if (
				typeof this.selectedel !== 'undefined' &&
				typeof this.elements[this.selectedel] !== 'undefined'
			) {
				cidata = this.elements[this.selectedel]
			}
			return cidata
		}
	},
	methods: {
		toggleLabels() {
			this.$store.commit('TOGGLE_LABELS')
		},
		setElementRoute() {
			if (typeof this.selectedel !== 'undefined') {
				if (
					this.elements[this.selectedel][this.paramkey] !=
					this.$route.params.element
				) {
					this.$router.push({
						name: 'section',
						params: {
							id: this.location.currentnode[this.paramkey],
							element: this.elements[this.selectedel][
								this.paramkey
							]
						}
					})
				}
			} else {
				this.$router.push({
					name: 'section',
					params: {
						id: this.location.currentnode[this.paramkey]
					}
				})
			}
		},
		selectRouteElement() {
			let self = this
			if (typeof this.$route.params.element !== 'undefined') {
				let foundIndex = findIndex(self.elements, function(o) {
					return o[self.paramkey] == self.$route.params.element
				})
				//console.log(this.$route.params.element, foundIndex)
				if (foundIndex > -1) {
					self.selectedel = foundIndex
					this.scrollTo()
				} else {
					self.selectedel = undefined
				}
			} else {
				self.selectedel = undefined
			}
		},
		scrollTo() {
			if (this.panel.indexOf(2) < 0) {
				this.panel.push(2)
			}
			let _this = this
			setTimeout(function() {
				let target = _this.$el.querySelector('#element-details')
				let container = _this.$el.querySelector(
					'#section-columns-panel'
				)
				_this.$vuetify.goTo(target, { container: container })
			}, 100)
		}
	}
}
</script>
