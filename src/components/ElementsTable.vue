<template>
	<div
		v-if="showelements && !homeState && $vuetify.breakpoint.mdAndDown"
		id="elements-container"
		class="flex-grow-1"
	>
		<v-card
			tile
			flat
			class="element-card elements-list"
			color="rgba(0, 255, 0, 0)"
		>
			<v-item-group v-model="selectedel">
				<v-row no-gutters>
					<v-col
						class="element-col"
						v-for="(item, i) in elements"
						:key="i"
					>
						<v-item v-slot:default="{ active, toggle }">
							<div class="element-box">
								<v-tooltip bottom>
									<template v-slot:activator="{ on }">
										<v-img
											v-on="on"
											:src="item.imageSm"
											aspect-ratio="1"
											style="cursor:pointer;"
											class="ma-1"
											:class="
												active
													? 'element-thumb active'
													: 'element-thumb'
											"
											@click="toggle"
											:alt="item.cititle"
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
									</template>
									<span>{{ item.cititle }}</span>
								</v-tooltip>
							</div>
						</v-item>
					</v-col>
				</v-row>
			</v-item-group>
		</v-card>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { findIndex } from 'lodash'
export default {
	name: 'elementstable',
	components: {},
	data: () => ({
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
			'showelements',
			'assets',
			'tourmode',
			'route'
		]),
		...mapGetters(['location', 'homeState']),
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
		setElementRoute() {
			this.$store.commit('OPEM_ELEMENTS_TABLE')
			if( this.$vuetify.breakpoint.mdAndDown){
			this.$store.commit('CLOSE_MINIMAP')
			}
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
				} else {
					self.selectedel = undefined
				}
			} else {
				self.selectedel = undefined
			}
		}
	}
}
</script>

<style lang="scss">
#elements-container {
	display: flex;
	position: absolute;
	max-width: 440px;
	top: 150px;
	left: 15px;
	right: 15px;
	margin-left: auto;
	margin-right: auto;
	// left: 50%;
	// transform: translate(-50%, -0%);

	background: rgba(0, 0, 0, 0);
	z-index: 1;
}

.element-box {
	align-self: flex-start;
	width: 2.5rem;
}

.element-col {
	flex-grow: 0;
}

.element-thumb {
	box-shadow: 3px 3px 5px #8888884f;
	// border: 1px solid #5252523d;
	background-color: rgba(220, 223, 226, 0.5);
	&.active {
		background-color: #ffffff;
	}
}
</style>
