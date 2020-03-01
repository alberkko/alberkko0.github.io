<template>
    <v-app-bar 
    app
    flat
		dense
		height="50"
    style='top: 85px'
    clipped-right
    color = '#fff'
    >

    <ToggleTour></ToggleTour>
    <v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn
						small
						tile
						class="grey lighten-2"
						v-on="on"
						@click="toggleAllPanels"
						:class="allpanels ? 'v-btn--active' : ''"
					>
						<v-icon v-if="!allpanels">mdi-eye-outline</v-icon>
						<v-icon v-if="allpanels">mdi-eye-off-outline</v-icon>
					</v-btn>
				</template>
				<span v-if="!allpanels">{{ $t('show_all') }}</span>
				<span v-if="allpanels">{{ $t('hide_all') }}</span>
			</v-tooltip>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn
						small
						tile
						class="grey lighten-2"
						v-on="on"
						@click="toggleQuantities"
						:class="showlabels ? 'v-btn--active' : ''"
					>
						<v-icon>mdi-bottle-wine</v-icon>
					</v-btn>
				</template>
				<span v-if="!showlabels">{{ $t('quantity_on') }}</span>
				<span v-if="showlabels">{{ $t('quantity_off') }}</span>
			</v-tooltip>

    </v-app-bar>
</template>


<script>

import ToggleTour from '../components/ToggleTour'
import { mapState } from 'vuex'
export default{
  name: 'UtilityToolbar',
  components : {
    ToggleTour
  },
	data: () => ({

  }),
  	computed: {
		...mapState(['mainNavigation', 'previewpanels', 'showlabels'])
  },
  	methods: {
		toggleAllPanels() {
			if (this.allpanels) {
				//this.allpanels = false
				this.$store.commit('EMPTY_PREVIEW')
			} else {
				//this.allpanels = true
				this.$store.commit('PREVIEW_ALL')
			}
		},
		toggleQuantities() {
			this.$store.commit('TOGGLE_LABELS')
		}
	}
  
}

</script>

<style scoped>
.utility-toolbar{
  top : 185px;
}
</style>