import Vue from 'vue'
import Vuex from 'vuex'
import DataService from '@/services/DataService.js'

//import { eachDeep } from 'deepdash-es/standalone'
import { eachDeep } from 'deepdash/standalone'
import { merge } from 'lodash'
import { clone } from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		dataloaded: false,
		drawer: null,
		rightdrawer: false,
		isfullscreen: false,
		sound: false,
		animationplaying: false,
		animationinterrupted: false,
		manualprogress: false,
		animationprogress: 0,
		cc_enabled: 1,
		animationLoading: false,
		currentlang: 'en',
		tablesdialog: false,
		legaldialog: false,
		infodialog: false,
		referencesdialog: false,
		langlist: [
			{ id: 'en', code: 'EN', label: 'English' },
			{ id: 'de', code: 'DE', label: 'Deutch' },
			{ id: 'fr', code: 'FR', label: 'Française' },
			{ id: 'es', code: 'ES', label: 'Español' }
		],
		navigation: {},
		mainNavigation: {},
		micrositeNavigation: {},
		secondaryNavigation: {},
		relatedDocuments: {},
		assets: {},
		ciextra: {},
		cirefcode: {},
		previewpanels: 'none',
		selectedElement: false,
		showlabels: false,
		showminimap: true,
		showelements: false,
		savescr: 0,
		tourmode: true,
		tourautoplay: false,
		tourlist: [],
		tourcurrentstep: 1,
		toursteptransitioning: true,
		tourstepjump: false,
		tourstepplaying: false,
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
		TOGGLE_TOUR_AUTOPLAY(state, val) {
			//console.log('autoplay toggle')
			if (val) {
				state.tourautoplay = !state.tourautoplay
			} else {
				state.tourautoplay = !state.tourautoplay
			}
		},
		TOGGLE_TOUR_STEPTRANSITIONING(state, val) {
			state.toursteptransitioning = val
		},
		TOGGLE_TOUR_STEPJUMP(state, val) {
			state.tourstepjump = val
		},
		TOGGLE_TOUR_STEPPLAYING(state, val) {
			state.tourstepplaying = val
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
		SET_INFO_DIALOG(state, val) {
			state.infodialog = val
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
		TOGGLE_ANIMATIONPLAYING(state, val) {
			if (typeof val != 'undefined') {
				state.animationplaying = val
			} else {
				state.animationplaying = !state.animationplaying
			}
		},
		TOGGLE_ANIMATIONINTERRUPTED(state, val) {
			if (typeof val != 'undefined') {
				state.animationinterrupted = val
			} else {
				state.animationinterrupted = !state.animationinterrupted
			}
		},
		SET_MANUAL_PROGRESS(state, val) {
			state.manualprogress = val
		},
		SET_ANIMATIONPROGRESS(state, val) {
			state.animationprogress = val
		},
		TOGGLE_SOUND(state) {
			state.sound = !state.sound
		},
		TOGGLE_SOUND_ON(state, val) {
			state.sound = val
		},
		TOGGLE_CC(state, val) {
			state.cc_enabled = val
		},
		TOGGLE_ANIMATIONLOADING(state, val) {
			state.animationLoading = val
		},
		TOGGLE_MINIMAP(state, val) {
			if (typeof val != 'undefined') {
				state.showminimap = val
			} else {
				state.showminimap = !state.showminimap
			}
		},
		TOGGLE_ELEMENTS(state, val) {
			if (typeof val != 'undefined') {
				state.showelements = val
			} else {
				state.showelements = !state.showelements
			}
		},
		CLOSE_ELEMENTS_TABLE(state) {
			state.showelements = false
		},
		OPEM_ELEMENTS_TABLE(state) {
			state.showelements = true
		},
		CLOSE_MINIMAP(state) {
			state.showminimap = false
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
			state.navigation.route = 'home'
			state.navigation.ishome = true
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
					state.mainNavigation.route = 'ironmetabolism'
					//state.mainNavigation.ishome = true
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
				let foundMicrositeNav = state.navigation.childs.find(function(
					obj
				) {
					return obj.key === 'Microsite'
				})
				if (typeof foundMicrositeNav !== 'undefined') {
					state.micrositeNavigation = foundMicrositeNav
					state.micrositeNavigation.route = 'microsite'
					state.micrositeNavigation.ishome = false
					state.micrositeNavigation.childs.forEach(node => {
						merge(node, this.getters.getCIExtra(node.cid))
						node.route = 'microsite'
						node.ishome = false
					})
				}
				let foundSecondaryNav = state.navigation.childs.find(function(
					obj
				) {
					return obj.key === 'SecondaryNavigation'
				})
				if (typeof foundSecondaryNav !== 'undefined') {
					state.secondaryNavigation = foundSecondaryNav
					state.secondaryNavigation.route = 'secondaryNavigation'
					state.secondaryNavigation.ishome = false
					state.secondaryNavigation.childs.forEach(node => {
						merge(node, this.getters.getCIExtra(node.cid))
						node.route = 'secondaryNavigation'
						node.ishome = false
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
		chageTourStep({ state, commit, getters }, { direction, jump, step }) {
			if (jump) {
				commit('TOGGLE_TOUR_STEPJUMP', true)
			}
			if (direction == 'prev') {
				if (state.tourcurrentstep == 1) {
					//console.log('Move to PREV section')
					let prevAnimation = getters.location.prevanimation
					let route = {
						name: state.route.name,
						params: {
							locale: this.$app.$i18n.locale,
							id: prevAnimation[state.paramkey]
						}
					}
					this.$app.$router.push(route)
					// Move to last step of prev animation
					commit('CHANGE_STEP', prevAnimation.steps.length)
				} else {
					let prevvalue = state.tourcurrentstep - 1
					commit('CHANGE_STEP', prevvalue)
				}
			} else if (direction == 'next') {
				if (!jump || !state.toursteptransitioning) {
					let stepslength = getters.location.currentnode.steps.length
					if (state.tourcurrentstep == stepslength) {
						//console.log('Move to NEXT section')
						let nextAnimation = getters.location.nextanimation
						let route = {
							name: state.route.name,
							params: {
								locale: this.$app.$i18n.locale,
								id: nextAnimation[state.paramkey]
							}
						}
						this.$app.$router.push(route)
						commit('CHANGE_STEP', 1)
					} else {
						let prevvalue = state.tourcurrentstep + 1
						commit('CHANGE_STEP', prevvalue)
					}
				}
			} else {
				commit('CHANGE_STEP', step)
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
			let locationMainNav = clone(state.navigation)
			locationMainNav.childs = []
			locationMainNav.childs.push(state.mainNavigation)
			if (typeof state.micrositeNavigation.childs != 'undefined') {
				state.micrositeNavigation.childs.forEach(function(item) {
					locationMainNav.childs.push(item)
				})
			}
			//console.log(state.route, state.route.params)
			location.pathlist.push(locationMainNav)
			if (state.route.name == 'ironmetabolism') {
				location.currentnode = state.mainNavigation
				location.pathlist.push(state.mainNavigation)
				location.currentnode.cid = state.navigation.cid
				/* if (typeof state.micrositeNavigation.childs != 'undefined') {
					state.micrositeNavigation.childs.forEach(function(item) {
						location.pathlist.push(item)
					})
				} */
			} else if (
				state.route.name == 'section' &&
				typeof state.route.params.id != 'undefined'
			) {
				//console.log(state.route);
				eachDeep(
					state.mainNavigation,
					(child, index, parent, ctx) => {
						if (child.refcode == state.route.params.id) {
							ctx.parents.forEach((element, ind) => {
								if (ind == 0) {
									//element.value.route = 'home'
									//element.value.ishome = true
								} else {
									element.value.route = 'section'
									element.value.ishome = false
								}
								element.value.current = false
								location.pathlist.push(element.value)
							})
							//console.log(ctx)
							child.route = 'section'
							child.ishome = location.pathlist.length == 0
							child.current = true
							child.parentid = parent.cid
							child.parentcode = parent[state.paramkey]
							child.index = index
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
							let itindex = parseInt(index)
							if (ctx.isLeaf) {
								// Dealing with a leaf object
								/* console.log(
									'Case 1',
									itindex,
									ctx.isLeaf,
									ctx.parent.key
								) */
								if (typeof ctx.parent.key != 'undefined') {
									// Case when dealing with a subsection
									/* console.log(
										'Case 1.1',
										itindex,
										ctx.isLeaf,
										ctx.parent.key
									) */
									if (
										itindex + 1 <
										ctx.parent.value.childs.length
									) {
										// Case subsection is the last or only child, move to next parent sibling
										let nextsubindex = itindex + 1
										location.nextanimation =
											ctx.parent.value.childs[
												nextsubindex
											]
										/* console.log(
											'Case 1.1.1',
											itindex,
											nextsubindex,
											ctx.isLeaf,
											ctx.parent.key
										) */
									} else {
										// Case subsection is NOT the last or only child, move to next subsection sibling
										let nextparentindex =
											(parseInt(ctx.parent.key) + 1) %
											ctx.parent.parent.value.childs
												.length
										location.nextanimation =
											ctx.parent.parent.value.childs[
												nextparentindex
											]
										/* console.log(
											'Case 1.1.2',
											itindex,
											nextparentindex,
											ctx.isLeaf,
											ctx.parent.key
										) */
									}
									if (itindex - 1 < 0) {
										// Case subsection is the first or only child, move to previous subsection sibling
										if (
											ctx.parent.value[state.paramkey] ==
											'regulation1'
										) {
											location.prevanimation =
												ctx.parent.parent.value.childs[
													ctx.parent.key - 1
												]
										} else {
											location.prevanimation =
												ctx.parent.value
										}
										/* console.log(
											'Case 1.1.3',
											itindex,
											ctx.parent.key,
											ctx.isLeaf,
											ctx.parent.key
										) */
									} else {
										// Case subsection is NOT the first or only child, move to previous parent sibling
										let prevsubindex = itindex - 1
										location.prevanimation =
											ctx.parent.value.childs[
												prevsubindex
											]
										/* console.log(
											'Case 1.1.4',
											itindex,
											prevsubindex,
											ctx.isLeaf,
											ctx.parent.key
										) */
									}
								} else {
									// Case when dealing with a section
									let nextindex =
										(itindex + 1) %
										ctx.parent.value.childs.length
									location.nextanimation =
										ctx.parent.value.childs[nextindex]
									let previndex =
										(ctx.parent.value.childs.length +
											(itindex - 1)) %
										ctx.parent.value.childs.length
									if (
										ctx.parent.value.childs[previndex]
											.childs.length
									) {
										location.prevanimation =
											ctx.parent.value.childs[
												previndex
											].childs[
												ctx.parent.value.childs[
													previndex
												].childs.length - 1
											]
									} else {
										location.prevanimation =
											ctx.parent.value.childs[previndex]
									}
									/* console.log(
										'Case 1.2',
										itindex,
										nextindex,
										ctx.isLeaf,
										ctx.parent.key
									) */
								}
							} else {
								// Dealing with a non-leaf object. Move to the first child
								location.nextanimation = child.childs[0]
								let previndex =
									(ctx.parent.value.childs.length +
										(itindex - 1)) %
									ctx.parent.value.childs.length
								if (
									ctx.parent.value.childs[previndex].childs
										.length
								) {
									location.prevanimation =
										ctx.parent.value.childs[
											previndex
										].childs[
											ctx.parent.value.childs[previndex]
												.childs.length - 1
										]
								} else {
									location.prevanimation =
										ctx.parent.value.childs[previndex]
								}
								/* console.log(
									'Case 2',
									itindex,
									0,
									previndex,
									ctx.isLeaf,
									ctx.parent.key
								) */
							}
							// Check if next animation is regulation1 main and set to first child subsection
							if (
								location.nextanimation[state.paramkey] ==
								'regulation1'
							) {
								location.nextanimation =
									location.nextanimation.childs[0]
							}

							// Set list of steps for the current node
							if (
								typeof location.currentnode.steps == 'undefined'
							) {
								location.currentnode.steps = []
								if (
									typeof location.currentnode.documentsinside[
										'IMS'
									] != 'undefined'
								) {
									location.currentnode.documentsinside[
										'IMS'
									].forEach(cid => {
										let item = {}
										if (
											typeof state.ciextra[cid] !=
											'undefined'
										) {
											item = state.ciextra[cid]
										}
										location.currentnode.steps.push(item)
									})
								}
							}
							//Brake loop since we found the item
							return false
						}
					},
					{
						childrenPath: 'childs'
					}
				)
			} else if (state.route.name == 'microsite') {
				if (state.micrositeNavigation.childs) {
					state.micrositeNavigation.childs.forEach(child => {
						if (child[state.paramkey] == state.route.params.id) {
							//console.log(child, state.route.params.id)
							location.currentnode = child
							location.pathlist.push(child)
							location.currentnode.cid = child.cid
						}
					})
				}
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
		microsite: state => {
			var nav = {}
			if (typeof state.navigation.childs !== 'undefined') {
				var foundnav = state.navigation.childs.find(function(obj) {
					return obj.key === 'Microsite'
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
			if (
				state.route.name != 'home' &&
				state.route.name != 'ironmetabolism'
			) {
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
		},
		isIM: state => {
			return (
				state.route.name == 'ironmetabolism' ||
				state.route.name == 'section'
			)
		},
		isIMLanding: state => {
			return state.route.name == 'ironmetabolism'
		},
		isMicrosite: state => {
			return state.route.name == 'microsite'
		},
		isSecondaryNavigation: state => {
			return state.route.name == 'secondaryNavigation'
		},
		isSection: state => {
			return state.route.name == 'section'
		}
	}
})
