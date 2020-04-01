<template>
	<v-app :class="savescr != 0 ? 'scr-mode' + mobileclass : mobileclass">
		<LeftRegion v-if="!homeState" />
		<Toolbar />
		<!-- <TourPanel /> -->
		<v-content>
			<AnimationPlayer v-show="isIM" />
			<HomeView v-if="homeState" />
			<MicrositeView v-if="isMicrosite" />
			<SecondaryNavigationView v-if="isSecondaryNavigation" />
		</v-content>
		<InformationDialog />
		<ElementDetailsDialog />
		<ElementsTable />
		<CopyrightWatermark v-if="savescr != 0" />
		<Referenes />
		<SWUpdatePopup />
		<v-overlay
			id="screenshot-overlay"
			:value="savescr != 0"
			z-index="200"
			class="text-center"
		>
			<v-progress-circular indeterminate size="64"></v-progress-circular>
			<div class="mt-3">{{ $t('screenshot_loader') }}</div>
		</v-overlay>
	</v-app>
</template>

<script>
import HomeView from './views/Home'
import MicrositeView from './views/Microsite'
import SecondaryNavigationView from './views/SecondaryNavigation'
import LeftRegion from './components/LeftRegion'
import AnimationPlayer from './components/AnimationPlayer'
import Toolbar from './components/Toolbar'
import InformationDialog from './components/InformationDialog'
import ElementDetailsDialog from './components/ElementDetailsDialog'
import ElementsTable from './components/ElementsTable'
import Referenes from './components/Referenes'
//import TourPanel from './components/TourPanel'
import CopyrightWatermark from './components/CopyrightWatermark'
import SWUpdatePopup from './components/SWUpdatePopup'

import store from '@/store/store.js'

import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
	name: 'App',
	data() {
		return {
			overlay: true
		}
	},
	computed: {
		...mapState(['currentlang', 'savescr']),
		...mapGetters([
			'homeState',
			'isIM',
			'isIMLanding',
			'isMicrosite',
			'isSecondaryNavigation'
		]),
		mobileclass() {
			let mobileclass = ''
			if (this.$vuetify.breakpoint.mdAndDown) {
				mobileclass = 'mobile-view'
			}
			return mobileclass
		}
	},
	components: {
		HomeView,
		MicrositeView,
		SecondaryNavigationView,
		Toolbar,
		LeftRegion,
		AnimationPlayer,
		InformationDialog,
		ElementDetailsDialog,
		ElementsTable,
		Referenes,
		//TourPanel,
		CopyrightWatermark,
		SWUpdatePopup
	},
	watch: {
		$route(to, from) {
			if (to.params.locale != from.params.locale) {
				store.dispatch('fetchData')
			}
		}
	},
	mounted() {
		if (this.$vuetify.breakpoint.mdAndDown) {
			this.$store.commit('TOGGLE_MINIMAP')
		}
		store.dispatch('fetchData')
	}
}
</script>
<style>
.mainnav-link {
	background-color: #ffffff !important;
}
.scrcanvas {
	position: fixed;
	top: 0;
	z-index: 100000;
	visibility: hidden;
}

.v-content{
	background: linear-gradient(0deg, #bbbdde 0%, white 100%);
}
</style>
