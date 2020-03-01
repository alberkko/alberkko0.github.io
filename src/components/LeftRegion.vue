<template>
	<v-navigation-drawer
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
</template>

<script>
export default {
	name: 'LeftRegion',
	data: () => ({}),
	computed: {
		drawer() {
			return (
				this.$store.state.drawer && this.$store.state.tourmode == false
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

<style scoped lang="scss"></style>
