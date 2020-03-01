<template>
	<v-tooltip bottom>
		<template v-slot:activator="{ on }">
			<v-btn small tile v-on="on" class="grey lighten-4" @click="toggleTour">
				<span>
					<v-icon color="primary">mdi-chevron-right</v-icon>
					<v-icon color="primary" style="margin-left:-22.5px;">mdi-chevron-right</v-icon>
					<v-icon color="primary" style="margin-left:-22.5px;">mdi-chevron-right</v-icon>
				</span>
				<span style="margin-left: -12px;">
					<v-icon color="primary">mdi-chevron-right</v-icon>
					<v-icon color="primary" style="margin-left:-22.5px;">mdi-chevron-right</v-icon>
					<v-icon color="primary" style="margin-left:-22.5px;">mdi-chevron-right</v-icon>
				</span>
				<span style="margin-left: -12px;">
					<v-icon color="primary">mdi-chevron-right</v-icon>
					<v-icon color="primary" style="margin-left:-22.5px;">mdi-chevron-right</v-icon>
					<v-icon color="primary" style="margin-left:-22.5px;">mdi-chevron-right</v-icon>
				</span>
			</v-btn>
		</template>
		<span>{{ $t('startguidedtour') }}</span>
	</v-tooltip>
</template>

<script>
export default {
	name: 'ToggleTour',
	methods: {
		toggleTour() {
			this.$store.dispatch('toggleTour')
		}
	}
}
</script>

<style></style>
