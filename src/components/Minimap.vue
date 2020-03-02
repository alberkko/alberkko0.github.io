<template>
	<div v-if="showminimap && enableMinimap && !tourmode" id="minimap-container">
		<v-card tile>
			<v-card-title dark class="subtitle-1 py-1 px-2 v-sheet-bg">
				{{ $t('minimap') }}
				<v-spacer></v-spacer>
				<v-icon v-if="$vuetify.breakpoint.mdAndDown" dark @click="toggleMinimap">mdi-close</v-icon>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text class="content-grey-bg pa-0">
				<div class="map-holder">
					<img src="@/assets/minimap.png" class="map-img" />
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<a
								id="absorption"
								@click="navigateto('absorption')"
								:class="isCurrent('absorption')"
								class="circle-mu"
								style="left:74.4px; top:20.4px;"
								v-on="on"
							></a>
						</template>
						<span class="text-uppercase">
							{{
							$t('absorption_sec_title')
							}}
						</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<a
								id="transport"
								@click="navigateto('transport')"
								:class="isCurrent('transport')"
								class="circle-mu"
								style="left:107.1px; top:54px;"
								v-on="on"
							></a>
						</template>
						<span class="text-uppercase">
							{{
							$t('transport_sec_title')
							}}
						</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<a
								id="usage"
								@click="navigateto('usage')"
								:class="isCurrent('usage')"
								class="circle-mu"
								style="left:93.9px; top:122px;"
								v-on="on"
							></a>
						</template>
						<span class="text-uppercase">
							{{
							$t('usage_sec_title')
							}}
						</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<a
								id="loss"
								@click="navigateto('loss')"
								:class="isCurrent('loss')"
								class="circle-mu"
								style="left:32.4px; top:140px;"
								v-on="on"
							></a>
						</template>
						<span class="text-uppercase">
							{{
							$t('loss_sec_title')
							}}
						</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<a
								id="recycling"
								@click="navigateto('recycling')"
								:class="isCurrent('recycling')"
								class="circle-mu"
								style="left:7.3px; top:95px;"
								v-on="on"
							></a>
						</template>
						<span class="text-uppercase">
							{{
							$t('recycling_sec_title')
							}}
						</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<a
								id="storage"
								@click="navigateto('storage')"
								:class="isCurrent('storage')"
								class="circle-mu"
								style="left:61.2px; top:78.5px;"
								v-on="on"
							></a>
						</template>
						<span class="text-uppercase">
							{{
							$t('storage_sec_title')
							}}
						</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<a
								id="regulation"
								@click="navigateto('regulation')"
								:class="isCurrent('regulation')"
								class="circle-mu"
								style="left:23px; top:39.2px;"
								v-on="on"
							></a>
						</template>
						<span class="text-uppercase">
							{{
							$t('regulation_sec_title')
							}}
						</span>
					</v-tooltip>
					<svg
						x="0px"
						y="0px"
						viewBox="0 0 130 166"
						style="enable-background:new 0 0 130 166;"
						xml:space="preserve"
						class="map-svg"
					>
						<path
							class="map-shape"
							d="M116.8,48.2c-5.3-7.1-12.2-13-20-17.3C85.7,20.5,87.7,1.4,87.7,1.4L76,7.8l-11.7-6l3,20.4
	c-12.2-0.5-24.4,2.5-35,8.6C21.7,36.9,13.1,46.2,7.6,57.1c-6.9,13.7-8.4,30-4.4,44.8c4,14.8,13.6,28,26.3,36.6l-9,7.2l2.7,13.2
	l13.4,3.5c0,0,7.6-11.5,26.3-12.9c8.4,0.4,16.8-0.8,24.7-3.6c19.1-6.9,34.5-23.4,39.8-42.9C132.5,84.4,128.4,63.6,116.8,48.2z
	 M65.9,131c-24.8,0-45-20.1-45-45s20.2-45,45-45c24.8,0,45,20.1,45,45S90.7,131,65.9,131z"
						/>
					</svg>
				</div>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions class="body-2 text-uppercase">
				{{
				location.navmaintitle
				}}
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
	name: 'Minimap',
	data: () => ({
		navmap: {
			absorption: 'absorption1',
			transport: 'transport1',
			regulation: 'regulation1',
			recycling: 'recycling1',
			loss: 'loss1',
			storage: 'storage1',
			usage: 'usage1'
		}
	}),
	computed: {
		...mapState(['dataloaded', 'showminimap', 'tourmode', 'paramkey']),
		...mapGetters(['location', 'enableMinimap'])
	},
	methods: {
		navigateto(to) {
			this.$router.push({
				name: 'section',
				params: { id: this.navmap[to] }
			})
		},
		isCurrent(code) {
			let iscurrent = 'default_grad'
			if (
				this.location.currentnode[this.paramkey] == this.navmap[code] ||
				this.location.currentnode.parentcode == this.navmap[code]
			) {
				iscurrent = 'active'
			}
			return iscurrent
		},
		toggleMinimap() {
			this.$store.commit('TOGGLE_MINIMAP')
		}
	}
}
</script>

<style lang="scss">
#minimap-container {
	position: absolute;
	top: 5px;
	right: 15px;
	background: white;
	z-index: 1;
}
.map-holder {
	width: 130px;
	height: 170px;
	margin: 0 20px;
	position: relative;
}
.map-shape {
	fill: #fff;
	stroke: rgb(150, 150, 150);
}
.map-img {
	position: absolute;
	display: none;
	.scr-mode & {
		display: block;
	}
}
.circle-mu {
	position: absolute;
	width: 13px;
	height: 13px;
	border-radius: 100%;
	border: 1px solid #424242;
	background: rgb(181, 181, 181);
	background: linear-gradient(
		135deg,
		rgba(181, 181, 181, 1) 0%,
		rgba(247, 247, 247, 1) 100%
	);
	&:hover {
		background: rgb(213, 213, 213);
		background: linear-gradient(
			135deg,
			rgba(213, 213, 213, 1) 0%,
			rgba(249, 249, 249, 1) 100%
		);
	}
	&.active {
		background: rgb(187, 209, 226);
		background: linear-gradient(
			135deg,
			rgba(187, 209, 226, 1) 0%,
			rgba(50, 93, 123, 1) 100%
		);
	}
}
.map-svg {
	.scr-mode & {
		display: none;
	}
}
.default_grad {
	fill: url(#default_grad);
	stroke: rgb(60, 60, 60);
	stroke-miterlimit: 10;
}
.active_grad {
	fill: url(#active_grad);
	stroke: rgb(60, 60, 60);
	stroke-miterlimit: 10;
}
.hover_grad {
	fill: url(#hover_grad);
	stroke: rgb(60, 60, 60);
	stroke-miterlimit: 10;
}
circle:hover {
	cursor: pointer;
}
</style>
