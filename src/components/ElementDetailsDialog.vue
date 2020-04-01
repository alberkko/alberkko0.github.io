<template>
	<transition name="slide-fade" class="details-transition">
		<div
			class="details-container"
			v-if="element && $vuetify.breakpoint.mdAndDown"
		>
			<v-card class="dialog-content">
				<v-card-title class="pa-0">
					<v-toolbar flat dark dense class="v-sheet-bg">
						<v-toolbar-title>
							{{ $t('sectiondesclabel') }}
						</v-toolbar-title>
						<v-spacer />
						<v-btn icon dark @click="selectedel = undefined">
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</v-toolbar>
				</v-card-title>
				<v-card-text
					class="pa-3 element-content"
					style="color: rgba(0, 0, 0, 0.87)"
				>
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
					<div>{{ element.cidescription }}</div>
					<div v-html="element.fc"></div>
				</v-card-text>
			</v-card>
		</div>
	</transition>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { findIndex } from 'lodash'
export default {
	name: 'ElementDetailsDialog',
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
			'dataloaded',
			'selectedElement',
			'assets',
			'tourmode',
			'route',
			'persistdialog'
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

<style>
.details-container {
	position: absolute;
	max-width: 600px;
	top: 30%;
	left: 0;
	right: 0;
	margin-left: auto;
	margin-right: auto;
	z-index: 102;
}

.element-content {
	max-height: 600px;
	overflow-y: auto;
}

.v-sheet-bg {
	border-top-right-radius: 4px;
	border-top-left-radius: 4px;
}

@media only screen and (max-width: 650px) {
	.details-container {
		top: 28%;
		left: 23px;
		right: 23px;
		margin-left: auto;
		margin-right: auto;
	}
	.element-content {
		max-height: 450px;
	}
}

.slide-fade-enter-active {
	transition: all 0.2s ease;
}
.slide-fade-leave-active {
	transition: all 0.4s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
	transform: translateY(300px);
	opacity: 1;
}
</style>
