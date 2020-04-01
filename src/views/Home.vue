<template>
	<div class="fill-height">
		<v-container class="fill-height animation-section">
			<div class="home left-column-wraper d-flex flex-column">
				<v-card outlined class="pa-2 home-card">
					<v-card-title class="headline mb-1">{{ mainNavigation.name }}</v-card-title>
					<v-card-text>An ingenious, interactive online version of the IronAtlas was developed with the help of medical experts and scientific agencies based on an originally simple written illustration of the individual stages of iron metabolism in A3 and poster format.</v-card-text>
					<v-card-actions>
						<v-btn
							:to="{name: mainNavigation.route}"
							depressed
							dark
							color="rgb(0, 102, 255)"
						>Online Version</v-btn>
						<v-btn
							outlined
							color="rgb(0, 102, 255)"
							class="install-app-btn"
							@click="install_btn_tracker"
						>Install App</v-btn>
					</v-card-actions>
				</v-card>

				<v-list class="pb-0 resnews flex-grow-1">
					<template v-for="(item, ind) in micrositeNavigation.childs">
						<v-list-item
							:key="item.cid"
							:to="{
						name: item.route,
						params: { id: item[paramkey] }
					}"
							class="section-nav-link"
							active-class="active"
						>
							<v-list-item-content>
								<v-list-item-title class="text-uppercase subtitle-1 font-weight-medium">{{ item.name }}</v-list-item-title>
							</v-list-item-content>
							<v-list-item-icon>
								<v-icon>mdi-chevron-right</v-icon>
							</v-list-item-icon>
						</v-list-item>
						<v-divider :key="ind"></v-divider>
					</template>
				</v-list>
			</div>
			<span class="bg"></span>
		</v-container>
		<HomeFooter></HomeFooter>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import HomeFooter from '../components/HomeFooter'
export default {
	name: 'Home',
	methods: {
		install_btn_tracker() {
			this.$gtag.event('install_app', {
				event_category: 'app_installation'
			})
		}
	},
	components: {
		HomeFooter
	},

	data: () => ({}),
	computed: {
		...mapState([
			'mainNavigation',
			'micrositeNavigation',
			'paramkey',
			'secondaryNavigation'
		])
	},
}
</script>


<style scoped lang="scss">
.left-column-wraper {
	max-width: 500px;
	left: 5vw;
	margin-right: 5vw;
	position: absolute;
	z-index: 1;
}

.fill-height {
	height: 100%;
}

.container {
	padding: 0%;
}

.theme--light.v-list {
	background-color: rgb(1, 1, 1, 0);
}

.theme--light.v-card {
	background-color: rgb(1, 1, 1, 0);
	border: dotted thin rgba(0, 0, 0, 0.4) !important;
}

.resnews {
	padding-top: 50px;
}

.home {
	height: 100%;
	padding-top: 20vh;
}

.headline {
	font-weight: 700 !important;
	text-transform: uppercase;
}

.install-app-btn {
	border: dotted thin rgba(0, 0, 0, 0.4) !important;
	border-color: rgb(255, 0, 51) !important;
}

.bg {
	width: 100%;
	height: 100%;
	margin-left: 20%;
	background: url('../assets/homebackground24.jpg') no-repeat center center;
	background-size: contain;
	transform: scale(1);
	opacity: 0.4;
}

.v-card__text {
	color: rgb(0, 0, 0) !important;
}

.v-content {
	background-color: #bbbdde;
}

@media only screen and (max-width: 1400px) {
	.bg {
		width: 100%;
		height: 100%;
		margin-left: 20vw;
		background: url('../assets/homebackground24.jpg') no-repeat center
			center;
		background-size: cover;
		transform: scale(1);
		opacity: 0.4;
	}
}

@media only screen and (max-width: 600px) {
	.bg {
		width: 100%;
		height: 100%;
		margin-left: 20vw;
		background: url('../assets/homebackground24.jpg') no-repeat center
			center;
		background-size: cover;
		transform: scale(1);
		opacity: 0.2;
	}
}
</style>
