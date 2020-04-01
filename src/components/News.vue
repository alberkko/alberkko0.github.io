<template>
	<div class="scroll">
		<v-row justify="center">
			<v-expansion-panels v-model="panel" multiple focusable>
				<h1 class="page-title">{{maindata.name}}</h1>
				<v-expansion-panel v-for="(item, ind) in newsdata" :key="item.cid" :index="ind">
					<v-expansion-panel-header>{{item.cititle}}</v-expansion-panel-header>
					<v-expansion-panel-content class="content">
						<v-card class="mx-auto" flat>
							<v-list-item>
								<v-list-item-content>
									<div class="overline mb-4">{{maindata.name}}</div>
									<v-card-text class="news-title mb-1">{{item.cititle}}</v-card-text>
									<v-card-text>
										<div v-html="item.fc"></div>
									</v-card-text>
								</v-list-item-content>
								<v-img height="150" cover :src="item.imageSm"></v-img>
							</v-list-item>
						</v-card>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-row>
	</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'News',
	data: () => ({
		panel: [0, 0]
	}),
	computed: {
		...mapState(['assets']),
		maindata() {
			var data = {
				name: 'News',
				childs: [],
				documentsinside: {
					NI: []
				}
			}
			if (typeof this.$store.getters.microsite.childs !== 'undefined') {
				data = this.$store.getters.microsite.childs[0]
			}
			return data
		},
		newsdata() {
			var itemsfound = []
			this.maindata.documentsinside.NI.forEach(id => {
				var item = this.$store.getters.getCIExtra(id)
				if (item.imageSm_id != '') {
					item.imageSm = this.assets[item.imageSm_id].asset_fileurl
				}
				itemsfound.push(item)
			})
			return itemsfound
		}
	},
	methods: {}
}
</script>

<style lang="scss" scoped>
.scroll {
	height: 100vh;
	overflow-y: scroll;
	overflow-x: hidden;
}

.news-title{
	font-weight: 500;
	font-size: x-large;
}

.v-expansion-panels:not(.v-expansion-panels--accordion):not(.v-expansion-panels--tile)
	> .v-expansion-panel--next-active
	.v-expansion-panel-header {
	border-bottom-left-radius: 0px !important;
	border-bottom-right-radius: 0px !important;
}

.theme--light.v-expansion-panels.v-expansion-panels--focusable .v-expansion-panel-header--active:hover::before, .theme--light.v-expansion-panels.v-expansion-panels--focusable .v-expansion-panel-header--active::before{
	opacity: 0 !important;
}

.theme--light.v-expansion-panels.v-expansion-panels--focusable .v-expansion-panel-header:hover::before{
opacity: 0 !important;
}

.v-expansion-panel-header--active{
	color: white;
	background-color: #9d1f30;
}

.v-responsive {
	max-width: 20%;
}

.page-title{
flex: 1;
color: #9d1f30;
}
.v-expansion-panels {
	width: 65%;
	top: 150px;
	margin-bottom: 120px;
}
.v-expansion-panel {
	margin-left: 0%;
}
.content {
	padding-top: 20px;
	flex-direction: row !important;
}

.v-list-item{
	flex-direction: row;
}

.v-expansion-panel-content__wrap {
	display: flex;
	flex-direction: row !important;
}

.v-card__text {
	padding-left: 0;
	padding-top: 0;
	line-height: 170%;
}

.v-card__actions{
	padding-top: 0;
}

.v-list-item__content{
	padding-bottom: 0;
}

@media only screen and (max-width: 768px) {
.v-responsive {
	max-width: 100%;
}
.v-list-item{
	flex-direction: column-reverse;
}
.news-title{
	font-weight: 500;
	font-size: large;
}

.v-expansion-panels {
	width: 80%;
}

}
</style>
