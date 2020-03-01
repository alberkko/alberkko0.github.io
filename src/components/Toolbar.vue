<template>
	<v-app-bar
		id="app-header"
		app
		clipped-left
		clipped-right
		dark
		transparent
		dense
		extension-height="35"
		height="50"
	>
		<!-- <v-app-bar-nav-icon @click.stop="toggleDrawer()" /> -->
		<a id="logolink" :href="logolink" target="_blank">
			<v-img
				id="app-logo"
				src="../assets/logo-big.png"
				alt="ironAtlass"
				height="50"
				max-height="50"
				width="98"
				max-width="98"
				contain
			/>
		</a>
		<v-toolbar-title class="pr-2 align-center d-none d-md-block" style="height:38px;">
			<span class="title font-weight-light font-italic">
				<small>The interactive medical iron portal</small>
			</span>
		</v-toolbar-title>
		<v-spacer />
		<span
			class="overline mr-3 pt-2 d-none d-sm-block"
			style="text-transform:none !important;"
		>Version 3.0</span>
		<v-btn icon @click.stop="toggleDrawer()" class="mr-1" v-if="!tourmode">
			<v-icon>mdi-menu</v-icon>
		</v-btn>
		<a class="vifor-link font-weight-medium" dark href="https://www.viforpharma.com/" target="_blank">
			<!-- <v-icon class="mr-1">mdi-menu</v-icon> -->
			Vifor Pharma
		</a>
		<template class="grey darken-1 pr-0" v-slot:extension>
			<v-breadcrumbs
				light
				:items="location.pathlist"
				class="pl-0 flex-nowrap"
				:class="tourmode ? 'tour-enabled' : ''"
			>
				<template v-slot:item="props">
					<v-breadcrumbs-item
						v-if="
							$vuetify.breakpoint.lgAndUp ||
								props.item.ishome ||
								props.item.current
						"
						class="text-truncate"
						:to="{
							name: props.item.route,
							params: { id: props.item[paramkey] }
						}"
						:active-class="
							props.item.current || tourmode
								? 'v-breadcrumbs__item--disabled'
								: ''
						"
						:disabled="tourmode"
						:class="!$vuetify.breakpoint.lgAndUp ? 'px-0' : ''"
					>
						<v-icon v-if="props.item.ishome" class="mr-1">mdi-home</v-icon>
						<template v-if="
								props.item.ishome && $vuetify.breakpoint.lgAndUp
							">
							<span>{{ props.item.name }}</span>
						</template>
						<template v-if="!props.item.ishome">
							<span class="d-block text-truncate">{{ props.item.name }}</span>
						</template>
					</v-breadcrumbs-item>
					<v-menu
						light
						bottom
						:disabled="tourmode"
						v-if="
							($vuetify.breakpoint.lgAndUp ||
								props.item.ishome) &&
								props.item.childs.length
						"
					>
						<template v-slot:activator="{ on: breadcrumb }">
							<v-btn icon v-on="{ ...breadcrumb }" :disabled="tourmode">
								<v-icon>mdi-chevron-right</v-icon>
							</v-btn>
						</template>
						<v-list class="nav-dropdown">
							<template v-for="(child, ind) in props.item.childs">
								<v-list-item
									:key="ind"
									:to="{
										name: 'section',
										params: { id: child[paramkey] }
									}"
								>
									<v-list-item-title>{{ child.name }}</v-list-item-title>
								</v-list-item>
								<template v-if="$vuetify.breakpoint.mdAndDown">
									<v-list-item
										v-for="(subchild,
										subind) in child.childs"
										:key="ind + '-' + subind"
										:to="{
											name: 'section',
											params: { id: subchild[paramkey] }
										}"
									>
										<v-list-item-title>
											<v-icon>mdi-chevron-right</v-icon>
											{{ subchild.name }}
										</v-list-item-title>
									</v-list-item>
								</template>
							</template>
						</v-list>
					</v-menu>
				</template>
				<template class="d-none" v-slot:divider>
					<v-icon></v-icon>
				</template>
			</v-breadcrumbs>
			<v-spacer></v-spacer>
			<v-spacer></v-spacer>
			<v-toolbar-items class>
				<v-tooltip bottom v-if="$vuetify.breakpoint.lgAndUp">
					<template v-slot:activator="{ on }">
						<v-btn
							light
							icon
							@click="toggleFullscreen"
							v-on="on"
							:class="isfullscreen ? 'v-btn--active' : ''"
						>
							<v-icon v-if="!isfullscreen">mdi-fullscreen</v-icon>
							<v-icon v-if="isfullscreen">mdi-fullscreen-exit</v-icon>
						</v-btn>
					</template>
					<span v-if="!isfullscreen">{{ $t('fullscreen_off') }}</span>
					<span v-if="isfullscreen">{{ $t('fullscreen_on') }}</span>
				</v-tooltip>
				<v-tooltip bottom v-if="$vuetify.breakpoint.lgAndUp">
					<template v-slot:activator="{ on }">
						<v-btn light icon v-on="on" @click="saveScreenshot" :disabled="savescr == 1" active-class>
							<v-icon>mdi-camera-outline</v-icon>
						</v-btn>
					</template>
					<span v-if="savescr == 0">{{ $t('screenshot') }}</span>
					<span v-if="savescr == 1">{{ $t('screenshot') }}</span>
					<span v-if="savescr == 2">{{ $t('screenshot') }}</span>
				</v-tooltip>
				<v-tooltip bottom v-if="$vuetify.breakpoint.lgAndUp">
					<template v-slot:activator="{ on }">
						<v-btn light icon v-on="on" @click="toggleSound">
							<v-icon v-if="sound">mdi-volume-high</v-icon>
							<v-icon v-if="!sound">mdi-volume-off</v-icon>
						</v-btn>
					</template>
					<span v-if="sound">{{ $t('sound_off') }}</span>
					<span v-if="!sound">{{ $t('sound_on') }}</span>
				</v-tooltip>
				<v-menu
					left
					bottom
					:open-on-hover="!$vuetify.breakpoint.mdAndDown"
					:close-on-content-click="$vuetify.breakpoint.mdAndDown"
					v-model="langmenuopen"
				>
					<template v-slot:activator="{ on: menu }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on: tooltip }">
								<v-btn light icon v-on="{ ...tooltip, ...menu }">{{ currentlangobj.code }}</v-btn>
							</template>
							<span>{{ currentlangobj.label }}</span>
						</v-tooltip>
					</template>

					<v-list class="lang-dropdown" v-model="currentlangobj">
						<v-list-item
							v-for="lang in langlist"
							:key="lang.id"
							@click="setLang(lang.id)"
							:class="
								currentlangobj.id == lang.id
									? 'v-list-item--active'
									: ''
							"
						>
							<v-list-item-title>{{ lang.label }}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
				<!-- <v-menu v-if="$vuetify.breakpoint.mdAndDown" left bottom> -->
				<v-menu left bottom>
					<template v-slot:activator="{ on: options }">
						<v-btn light icon v-on="{ ...options }">
							<v-icon>mdi-dots-vertical</v-icon>
						</v-btn>
					</template>
					<v-list class="mobile-options-dropdown" dense>
						<v-list-item
							link
							:input-value="showminimap"
							:disabled="!enableMinimap"
							@click="$store.commit('TOGGLE_MINIMAP')"
						>
							<v-list-item-icon>
								<v-icon>mdi-compass</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>{{ $t('minimap') }}</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item link @click="$store.commit('SET_TABLES_DIALOG', true)">
							<v-list-item-icon>
								<v-icon>mdi-file-table</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>
									{{
									$t('tableslabel')
									}}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item
							link
							:disabled="!existreferences"
							@click="
								$store.commit('SET_REFERENCES_DIALOG', true)
							"
						>
							<v-list-item-icon>
								<v-icon>mdi-asterisk</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>
									{{
									$t('referenceslabel')
									}}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-list-item link @click="$store.commit('SET_LEGAL_DIALOG', true)">
							<v-list-item-icon>
								<v-icon>mdi-information-outline</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>
									{{
									$t('legallabel')
									}}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
						<v-divider></v-divider>
						<v-list-item link @click="saveScreenshot" :disabled="savescr == 1">
							<v-list-item-icon>
								<v-icon>mdi-camera-outline</v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title>
									{{
									$t('screenshot')
									}}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-toolbar-items>
		</template>
	</v-app-bar>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
	name: 'Toolbar',
	data: () => ({
		closelangmenuonclick: false,
		langmenuopen: false
	}),
	computed: {
		...mapState([
			'paramkey',
			'dataloaded',
			'isfullscreen',
			'sound',
			'langlist',
			'currentlang',
			'tourmode',
			'showminimap',
			'savescr'
		]),
		...mapGetters(['currentlangobj', 'location', 'enableMinimap']),
		logolink() {
			let baseURL = 'https://ironatlas.medline.ch/'
			let langurl = 'ironatlas-'
			let langcode =
				this.$root.$i18n.locale == 'es' ? 'en' : this.$root.$i18n.locale
			let url = baseURL + langurl + langcode + '/'
			return url
		},
		existreferences() {
			let exist = false
			if (
				this.dataloaded &&
				typeof this.location.currentnode.related !== 'undefined' &&
				typeof this.location.currentnode.related['ELI'] !== 'undefined'
			) {
				exist = true
			}
			return exist
		}
	},
	watch: {
		langmenuopen(newValue) {
			this.$store.commit('SET_PERSIST_DIALOG', newValue)
		}
	},
	methods: {
		toggleDrawer() {
			this.$store.dispatch('toggleDrawer')
			if (this.$vuetify.breakpoint.lgAndUp) {
				this.$store.dispatch('toggleRightDrawer')
			}
		},
		toggleRightDrawer() {
			this.$store.dispatch('toggleRightDrawer')
		},
		toggleFullscreen() {
			this.$root.toggleFullscreen()
		},
		toggleSound() {
			this.$store.commit('TOGGLE_SOUND')
		},
		saveScreenshot() {
			//this.$root.saveScreenshot()
			let _this = this
			setTimeout(function() {
				_this.$store.commit('SET_SCR', 1)
			}, 1000)
		},
		setLang(val) {
			this.$store.dispatch('switchLanguage', val)
			//this.$root.$i18n.locale = val
		}
	}
}
</script>

<style lang="scss">
$ml: 16px;
$header-height: 50px;
#app-header {
	//background-color: #666666;
	background-color: #9d1f30;
	z-index: 101;

	#logolink {
		position: relative;
		width: 98px + $ml;
		height: $header-height;
		padding-left: $ml;
		margin-left: -$ml;
		left: 0;
		background: white;
		margin-right: 30px;
		&:after {
			display: block;
			content: ' ';
			position: absolute;
			width: 30px;
			height: 50px;
			background: white;
			right: -13px;
			top: 0;
			transform: skew(-22deg, 0deg);
		}
		#app-logo {
			position: absolute;
			top: 0;
			left: $ml;
			z-index: 1;
		}
	}

	.v-toolbar__extension {
		/* background: rgb(153, 154, 155);
		background: linear-gradient(
			180deg,
			rgba(153, 154, 155, 1) 0%,
			rgba(198, 203, 207, 1) 100%
		); */
		//background: #9d1f30;
		padding-right: 0;
		background: #f9fafc;
		border-top: 1px solid #c2c2c2;
		.mobile-view & {
			padding-right: 0;
		}
		.v-btn.v-btn--icon {
			color: rgba(0, 0, 0, 1);
		}
	}
	.v-breadcrumbs {
		padding: 0;
		.mobile-view & {
			max-width: 248px;
		}
	}
	.v-breadcrumbs__item {
		color: rgba(0, 0, 0, 1);
		.mobile-view & {
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.v-icon {
			color: rgba(0, 0, 0, 1);
		}
	}
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
	.nav-dropdown {
		min-width: 250px !important;
		.v-list-item .v-list-item__subtitle,
		.v-list-item .v-list-item__title {
			line-height: 48px;
		}
	}
	.lang-dropdown {
		min-width: 101px !important;
		.v-list-item .v-list-item__subtitle,
		.v-list-item .v-list-item__title {
			line-height: 48px;
		}
	}
	.mobile-options-dropdown {
		min-width: 230px !important;
		.v-list-item .v-list-item__subtitle,
		.v-list-item .v-list-item__title {
			line-height: 40px;
		}
	}
}
.v-breadcrumbs__divider {
	display: none !important;
}
.v-breadcrumbs.tour-enabled {
	> li {
		opacity: 0.4;
	}
}
.vifor-link {
	color: white !important;
	text-decoration: none !important;
}
</style>
