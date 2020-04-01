<template>
	<v-breadcrumbs light :items="location.pathlist" class="pl-0 flex-nowrap">
		<template v-slot:item="props">
			<!-- <v-breadcrumbs-item
				v-if="props.item.ishome"
				class="text-truncate"
				:to="{
					name: 'home'
				}"
				:active-class="homeState ? 'v-breadcrumbs__item--disabled' : ''"
				:disabled="tourmode"
				:class="!$vuetify.breakpoint.lgAndUp ? 'px-0' : ''"
			>
				<v-icon class="mr-1">mdi-home</v-icon>
				<template v-if="$vuetify.breakpoint.lgAndUp">
					<span class="d-block text-truncate mr-1">{{ $t('appname') }}</span>
				</template>
				<v-icon class="ml-2" style="font-size:24px;">mdi-chevron-right</v-icon>
			</v-breadcrumbs-item> -->
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
					props.item.current ? 'v-breadcrumbs__item--disabled' : ''
				"
				:class="!$vuetify.breakpoint.lgAndUp ? 'px-0' : ''"
			>
				<v-icon v-if="props.item.ishome" class="mr-1">mdi-home</v-icon>
				<template
					v-if="props.item.ishome && $vuetify.breakpoint.lgAndUp"
				>
					<span>{{ $t('appname') }}</span>
				</template>
				<template v-if="!props.item.ishome">
					<span class="d-block text-truncate">{{
						props.item.name
					}}</span>
				</template>
			</v-breadcrumbs-item>
			<v-menu
				light
				bottom
				v-if="
					($vuetify.breakpoint.lgAndUp || props.item.ishome) &&
						props.item.childs.length
				"
			>
				<template v-slot:activator="{ on: breadcrumb }">
					<v-btn icon v-on="{ ...breadcrumb }">
						<v-icon>mdi-chevron-right</v-icon>
					</v-btn>
				</template>
				<v-list class="nav-dropdown">
					<template v-for="(child, ind) in props.item.childs">
						<v-list-item
							:key="ind"
							:to="{
								name: child.route,
								params: { id: child[paramkey] }
							}"
						>
							<v-list-item-title>{{
								child.name
							}}</v-list-item-title>
						</v-list-item>
						<template v-if="$vuetify.breakpoint.mdAndDown">
							<v-list-item
								v-for="(subchild, subind) in child.childs"
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
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
	name: 'Breadcrumb',
	computed: {
		...mapState(['navigation', 'paramkey', 'dataloaded', 'tourmode']),
		...mapGetters(['currentlangobj', 'location', 'homeState'])
	}
}
</script>

<style></style>
