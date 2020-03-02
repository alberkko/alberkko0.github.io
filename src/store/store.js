import Vue from 'vue'
import Vuex from 'vuex'
import DataService from '@/services/DataService.js'

//import { eachDeep } from 'deepdash-es/standalone'
import { eachDeep } from 'deepdash/standalone'
import { merge } from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		dataloaded: false,
		drawer: null,
		rightdrawer: false,
		isfullscreen: false,
		sound: true,
		currentlang: 'en',
		tablesdialog: false,
		legaldialog: false,
		referencesdialog: false,
		langlist: [
			{ id: 'en', code: 'EN', label: 'English' },
			{ id: 'de', code: 'DE', label: 'Deutch' },
			{ id: 'fr', code: 'FR', label: 'Française' },
			{ id: 'es', code: 'ES', label: 'Español' }
		],
		navigation: {},
		mainNavigation: {},
		relatedDocuments: {},
		assets: {},
		ciextra: {},
		cirefcode: {},
		previewpanels: 'none',
		selectedElement: false,
		showlabels: false,
		showminimap: true,
		savescr: 0,
		tourmode: false,
		tourautoplay: true,
		tourlist: [],
		tourcurrentstep: 1,
		toursteptransitioning: true,
		tourstepjump: false,
		navtransitioning: true,
		persistdialog: false,
		paramkey: 'refcode'
	},
	mutations: {
		SET_NAV_TRANSITIONING(state, val) {
			//console.log('New navtransitioning: ', val)
			state.navtransitioning = val
		},
		TOGGLE_TOUR_MODE(state) {
			if (state.tourmode) {
				state.tourautoplay = false
			} else {
				state.tourautoplay = true
				state.tourcurrentstep = 1
			}
			state.tourmode = !state.tourmode
		},
		TOGGLE_TOUR_AUTOPLAY(state) {
			//console.log('autoplay toggle')
			state.tourautoplay = !state.tourautoplay
		},
		TOGGLE_TOUR_STEPTRANSITIONING(state, val) {
			state.toursteptransitioning = val
		},
		TOGGLE_TOUR_STEPJUMP(state, val) {
			state.tourstepjump = val
		},
		CHANGE_STEP(state, val) {
			state.tourcurrentstep = val
		},
		SET_DRAWER(state, val) {
			state.drawer = val
		},
		TOGGLE_DRAWER(state) {
			state.drawer = !state.drawer
		},
		SET_RIGHT_DRAWER(state, val) {
			state.rightdrawer = val
		},
		TOGGLE_RIGHT_DRAWER(state) {
			state.rightdrawer = !state.rightdrawer
		},
		SET_TABLES_DIALOG(state, val) {
			state.tablesdialog = val
		},
		SET_LEGAL_DIALOG(state, val) {
			state.legaldialog = val
		},
		SET_REFERENCES_DIALOG(state, val) {
			state.referencesdialog = val
		},
		SET_PERSIST_DIALOG(state, val) {
			state.persistdialog = val
		},
		TOGGLE_FULLSCREEN(state, val) {
			state.isfullscreen = val
		},
		TOGGLE_SOUND(state) {
			state.sound = !state.sound
		},
		TOGGLE_MINIMAP(state, val) {
			if (typeof val != 'undefined') {
				state.showminimap = val
			} else {
				state.showminimap = !state.showminimap
			}
		},
		SET_SCR(state, val) {
			state.savescr = val
		},
		SET_LANG(state, val) {
			state.currentlang = val
		},
		SET_PREVIEW(state, val) {
			state.previewpanels = val
		},
		EMPTY_PREVIEW(state) {
			state.previewpanels = 'none'
		},
		SET_ELEMENT(state, val) {
			state.selectedElement = val
		},
		EMPTY_ELEMENT(state) {
			state.selectedElement = false
		},
		PREVIEW_ALL(state) {
			state.previewpanels = 'all'
		},
		TOGGLE_LABELS(state, val) {
			if (typeof val !== 'undefined') {
				state.showlabels = val
			} else {
				if (state.showlabels) {
					state.showlabels = false
				} else {
					state.showlabels = true
				}
			}
		},
		SET_STRUCTURE(state, val) {
			state.navigation = val.tree[0]
			state.relatedDocuments = val.relatedDocuments
			state.assets = val.assets
			state.ciextra = val.ciextra
			state.cirefcode = val.cirefcode
			// Set initial main navigation currentnode
			if (typeof state.navigation.childs !== 'undefined') {
				var foundnav = state.navigation.childs.find(function(obj) {
					return obj.key === 'IronMetabolism'
				})
				if (typeof foundnav !== 'undefined') {
					state.mainNavigation = foundnav
					state.mainNavigation.route = 'home'
					state.mainNavigation.ishome = true
					state.mainNavigation.childs.forEach(node => {
						merge(node, this.getters.getCIExtra(node.cid))
						// Push item to tour list
						// Exclude "regulation1" as it does not contain animation
						if (node[state.paramkey] !== 'regulation1') {
							state.tourlist.push(node[state.paramkey])
						}
						if (node.childs.length) {
							node.childs.forEach(node => {
								state.tourlist.push(node[state.paramkey])
							})
						}
					})
				}
			}
			state.dataloaded = true
		}
	},
	actions: {
		toggleTour({ state, commit }) {
			// If entering guided tour, check if in home than navigate to first item
			if (!state.tourmode && state.route.name == 'home') {
				let route = {
					name: 'section',
					params: {
						locale: this.$app.$i18n.locale,
						id: state.mainNavigation.childs[0][state.paramkey]
					}
				}
				this.$app.$router.push(route)
			} else if (
				state.route.name == 'section' &&
				state.route.params.id == 'regulation1'
			) {
				let route = {
					name: 'section',
					params: {
						locale: this.$app.$i18n.locale,
						id: 'regulation2'
					}
				}
				this.$app.$router.push(route)
			} else {
				let route = {
					name: 'section',
					params: {
						locale: this.$app.$i18n.locale,
						id: this.$app.$route.params.id
					}
				}
				this.$app.$router.push(route)
			}
			commit('TOGGLE_TOUR_MODE')
		},
		chageTourStep({ state, commit, getters }, { direction, jump }) {
			if (jump) {
				commit('TOGGLE_TOUR_STEPJUMP', true)
			}
			if (direction == 'prev') {
				if (state.tourcurrentstep == 1) {
					//console.log('Move to PREV section')
					let currentAnimationIndex = state.tourlist.indexOf(
						getters.location.currentnode[state.paramkey]
					)
					let prevAnimationName =
						currentAnimationIndex != 0
							? currentAnimationIndex - 1
							: state.tourlist.length - 1
					//console.log(currentAnimationIndex, prevAnimationName)
					let route = {
						name: state.route.name,
						params: {
							locale: this.$app.$i18n.locale,
							id: state.tourlist[prevAnimationName]
						}
					}
					this.$app.$router.push(route)
					commit('CHANGE_STEP', 1)
				} else {
					let prevvalue = state.tourcurrentstep - 1
					commit('CHANGE_STEP', prevvalue)
				}
			} else {
				if (!jump || !state.toursteptransitioning) {
					let stepslength = getters.location.currentnode.steps.length
					if (state.tourcurrentstep == stepslength) {
						//console.log('Move to NEXT section')
						let currentAnimationIndex = state.tourlist.indexOf(
							getters.location.currentnode[state.paramkey]
						)
						let nextAnimationName =
							currentAnimationIndex < state.tourlist.length - 1
								? currentAnimationIndex + 1
								: 0
						let route = {
							name: state.route.name,
							params: {
								locale: this.$app.$i18n.locale,
								id: state.tourlist[nextAnimationName]
							}
						}
						this.$app.$router.push(route)
						commit('CHANGE_STEP', 1)
					} else {
						let prevvalue = state.tourcurrentstep + 1
						commit('CHANGE_STEP', prevvalue)
					}
				}
			}
		},
		toggleDrawer({ commit }) {
			commit('TOGGLE_DRAWER')
		},
		toggleRightDrawer({ commit }) {
			commit('TOGGLE_RIGHT_DRAWER')
		},
		toggleFullScreen({ commit }, val) {
			commit('TOGGLE_FULLSCREEN', val)
		},
		switchLanguage({ state, commit }, val) {
			this.$app.$i18n.locale = val
			commit('SET_LANG', val)
			let route = {
				name: state.route.name,
				params: {
					locale: val,
					id: state.route.params.id,
					element: state.route.params.element
				}
			}
			this.$app.$router.push(route)
		},
		fetchData({ commit, state }) {
			return DataService.getData(state.route.params.locale).then(
				response => {
					//console.log(response)
					commit('SET_STRUCTURE', response.data.data)
					commit('SET_LANG', state.route.params.locale)
				}
			)
			//.catch(error => {});
		}
	},
	modules: {},
	getters: {
		location: state => {
			var location = {
				pathlist: [],
				currentnode: {},
				subnavigation: []
			}
			if (state.route.name === 'home') {
				location.currentnode = state.mainNavigation
				location.pathlist.push(state.mainNavigation)
				location.currentnode.cid = state.navigation.cid
			} else if (
				state.route.name !== 'home' &&
				typeof state.route.params.id != 'undefined'
			) {
				//console.log(state.route);
				eachDeep(
					state.mainNavigation,
					(child, i, parent, ctx) => {
						if (child.refcode == state.route.params.id) {
							ctx.parents.forEach((element, ind) => {
								if (ind == 0) {
									element.value.route = 'home'
									element.value.ishome = true
								} else {
									element.value.route = 'section'
									element.value.ishome = false
								}
								element.value.current = false
								location.pathlist.push(element.value)
							})
							child.route = 'section'
							child.ishome = location.pathlist.length == 0
							child.current = true
							child.parentid = parent.cid
							child.parentcode = parent[state.paramkey]
							location.pathlist.push(child)
							location.currentnode = child
							location.currentnode.level = ctx.depth + 1
							location.currentnode.path = ctx.path
							location.currentnode.childrenPath = ctx.childrenPath
							if (ctx.depth == 1 && child.childs.length) {
								//console.log("CASE 1 - CHILD");
								//console.log(child);
								location.navmainid = child[state.paramkey]
								location.navmaintitle = child.name
								location.subnavigation = child.childs
							} else if (ctx.depth == 2) {
								//console.log("CASE 2 - PARENT");
								//console.log(parent);
								location.navmainid = parent[state.paramkey]
								location.navmaintitle = parent.name
								location.subnavigation = parent.childs
							} else {
								//console.log("CASE 3 - EMPTY");
								location.navmainid = child[state.paramkey]
								location.navmaintitle = child.name
								location.subnavigation = []
							}
							if (
								typeof location.currentnode.steps == 'undefined'
							) {
								location.currentnode.steps = []
								location.currentnode.documentsinside[
									'IMS'
								].forEach(cid => {
									let item = {}
									if (
										typeof state.ciextra[cid] != 'undefined'
									) {
										item = state.ciextra[cid]
									}
									location.currentnode.steps.push(item)
								})
							}
							//Brake loop since we found the item
							return false
						}
					},
					{
						childrenPath: 'childs'
					}
				)
			}
			// Find related documents
			location.currentnode.related = {}
			if (
				typeof state.relatedDocuments[location.currentnode.cid] !==
				'undefined'
			) {
				location.currentnode.related =
					state.relatedDocuments[location.currentnode.cid]
			}

			return location
		},
		currentlangobj: state => {
			var current = state.langlist.filter(function(lang) {
				return lang.id == state.currentlang
			})
			return current[0]
		},
		secondaryNavigation: state => {
			var nav = {}
			if (typeof state.navigation.childs !== 'undefined') {
				var foundnav = state.navigation.childs.find(function(obj) {
					return obj.key === 'SecondaryNavigation'
				})
				if (typeof foundnav !== 'undefined') {
					nav = foundnav
				}
			}
			return nav
		},
		getCIExtra: state => id => {
			var cidata = false
			if (typeof state.ciextra[id] !== 'undefined') {
				cidata = state.ciextra[id]
			}
			return cidata
		},
		enableMinimap: state => {
			let enable = false
			if (state.route.name != 'home') {
				enable = true
			}
			return enable
		},
		homeState: state => {
			let enable = false
			if (state.route.name == 'home') {
				enable = true
			}
			return enable
		}
	}
})
