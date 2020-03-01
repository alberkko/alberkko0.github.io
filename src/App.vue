<template>
	<v-app :class="savescr != 0 ? 'scr-mode' + mobileclass : mobileclass">
		<RightRegion />
		<UtilityToolbar />
		<LeftRegion />
		<Toolbar />
		<TourPanel />
		<v-content>
			<AnimationPlayer />
		</v-content>
		<Tables />
		<LegalNotice />
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
import LeftRegion from './components/LeftRegion'
import RightRegion from './components/RightRegion'
import AnimationPlayer from './components/AnimationPlayer'
import UtilityToolbar from './components/UtilityToolbar'
import Toolbar from './components/Toolbar'
import Tables from './components/Tables'
import LegalNotice from './components/LegalNotice'
import Referenes from './components/Referenes'
import TourPanel from './components/TourPanel'
import CopyrightWatermark from './components/CopyrightWatermark'
import SWUpdatePopup from './components/SWUpdatePopup'

import store from '@/store/store.js'

import { mapState } from 'vuex'

export default {
	name: 'App',
	data() {
		return {
			overlay: true
		}
	},
	computed: {
		...mapState(['currentlang', 'savescr']),
		mobileclass() {
			let mobileclass = ''
			if (this.$vuetify.breakpoint.mdAndDown) {
				mobileclass = 'mobile-view'
			}
			return mobileclass
		}
	},
	components: {
		Toolbar,
		LeftRegion,
		RightRegion,
		AnimationPlayer,
		UtilityToolbar,
		Tables,
		LegalNotice,
		Referenes,
		TourPanel,
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
</style>
