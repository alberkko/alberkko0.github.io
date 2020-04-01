<template>
	<div class="left-column-wraper d-flex flex-column">
		<div class="flex-grow-1">
			<v-list class="pb-0 pt-0">
				<v-list-item
					:to="{
					name: 'ironmetabolism'
				}"
					class="section-nav-link"
					active-class="active"
				>
					<v-list-item-icon>
						<v-icon>mdi-play-circle</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title
							class="text-uppercase subtitle-1 font-weight-medium"
						>{{ mainNavigation.name }}</v-list-item-title>
					</v-list-item-content>
					<v-list-item-icon>
						<v-icon>mdi-chevron-right-box-outline</v-icon>
					</v-list-item-icon>
				</v-list-item>
			</v-list>
			<v-divider></v-divider>
			<v-list class="pb-0 pt-0">
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
						<v-list-item-icon>
							<v-icon>mdi-newspaper</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title class="subtitle-1 font-weight-regular">{{ item.name }}</v-list-item-title>
						</v-list-item-content>
						<v-list-item-icon>
							<v-icon>mdi-chevron-right</v-icon>
						</v-list-item-icon>
					</v-list-item>
					<v-divider :key="ind"></v-divider>
				</template>
			</v-list>
		</div>

		<v-list class="pb-0 pt-0">
			<v-divider></v-divider>
			<template v-for="(item, ind) in secondaryNavigation.childs">
				<v-list-item
					:key="item.cid"
					:to="{
						name: item.route,
						params: { id: item[paramkey] }
					}"
					class="section-nav-link"
					active-class="active"
				>
					<!-- <v-list-item-icon>
						<v-icon>mdi-newspaper</v-icon>
					</v-list-item-icon>-->
					<v-list-item-content>
						<v-list-item-title class="subtitle-1 font-weight-regular">{{ item.name }}</v-list-item-title>
					</v-list-item-content>
					<v-list-item-icon>
						<v-icon>mdi-chevron-right</v-icon>
					</v-list-item-icon>
				</v-list-item>
				<v-divider :key="ind"></v-divider>
			</template>
		</v-list>
	</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'IMLandingLeft',
	components: {},
	data: () => ({
		panels: [],
		allpanels: false
	}),
	computed: {
		...mapState([
			'mainNavigation',
			'micrositeNavigation',
			'previewpanels',
			'showlabels',
			'paramkey',
			'secondaryNavigation'
		])
	}
}
</script>