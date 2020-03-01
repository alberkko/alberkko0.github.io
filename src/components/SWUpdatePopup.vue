<template>
	<v-snackbar
		class="d-none"
		v-if="showpopup"
		v-model="popup"
		:multi-line="multiLine"
		:timeout="timeout"
	>
		There is a new version.
		<v-btn color="white" text @click="reload">
			Update
		</v-btn>
	</v-snackbar>
</template>

<script>
import event from '../eventbus'
export default {
	name: 'SWUpdatePopup',
	data: () => ({
		popup: true,
		multiLine: true,
		timeout: 0,
		updateEvent: null,
		message: '',
		showpopup: false
	}),
	created() {
		//event.$on('sw-ready', this.onSWUpdated)
		//event.$on('sw-cached', this.onSWUpdated)
		//event.$on('sw-updatefound', this.onSWUpdated)
		event.$on('sw-updated', this.onSWUpdated)
	},
	methods: {
		onSWUpdated(e) {
			this.showpopup = true
			this.updateEvent = e
		},
		cancel() {
			this.showpopup = false
		},
		reload() {
			if (this.updateEvent) {
				this.updateEvent.skipWaiting().then(() => {
					location.reload(true)
				})
				this.updateEvent = null
			}
		}
	}
}
</script>

<style></style>
