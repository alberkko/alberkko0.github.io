<template>
	<div>
		<v-navigation-drawer
			v-if="isMicrosite || isSecondaryNavigation"
			id="left-column-micro"
			width="290"
			style="top: 85px"
			app
			clipped
			floating
			:value="drawer"
			@input="setDrawer($event)"
		>
			<router-view />
		</v-navigation-drawer>

		<v-navigation-drawer
			v-else
			id="left-column"
			width="315"
			style="top: 85px"
			app
			clipped
			floating
			:value="drawer"
			@input="setDrawer($event)"
		>
			<router-view />
		</v-navigation-drawer>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	name: 'LeftRegion',
	data: () => ({
		mini: true
	}),
	computed: {
		...mapGetters(['isMicrosite', 'isSecondaryNavigation']),
		drawer() {
			return (
				//this.$store.state.drawer && this.$store.state.tourmode == false
				this.$store.state.drawer
			)
		}
	},
	mounted() {
		if (this.$vuetify.breakpoint.lgAndUp) {
			this.$store.commit('SET_DRAWER', true)
		}
	},
	methods: {
		setDrawer(val) {
			if (!this.$vuetify.breakpoint.lgAndUp) {
				this.$store.commit('SET_DRAWER', val)
			}
		}
	}
}
</script>

<style scoped lang="scss">
#left-column-mico {
	max-height: calc(100% - 85px) !important;
	background-color: rgba(255, 255, 255, 1);
}

.left-column-wraper{
	height: 100%;
	border-right: solid 1px rgba(0, 0, 0, 0.12) !important;
}
</style>
