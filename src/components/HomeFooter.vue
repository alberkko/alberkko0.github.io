<template>
	<v-footer padless class="footer">
		<v-col class="text-center list-center">
			<v-list class="pb-0 secondary-nav-footer">
				<template v-for="(item) in secondaryNavigation.childs">
					<v-list-item
						:key="item.cid"
						:to="{
						name: item.route,
						params: { id: item[paramkey] }
					}"
						class
						active-class="active"
					>
						<v-list-item-content>
							<v-list-item-title class="subtitle-1 font-weight-regular">{{ item.name }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</template>
			</v-list>
		</v-col>
	</v-footer>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'Home',
	methods: {},
	components: {},

	data: () => ({}),
	computed: {
		...mapState([
			'mainNavigation',
			'micrositeNavigation',
			'paramkey',
			'secondaryNavigation'
		])
	}
}
</script>

<style scoped>
.footer {
	background-color: #bbbdde !important;
	margin-bottom: 100px;
}

.secondary-nav-footer {
	display: flex;
	flex-direction: row;
	margin-bottom: 0px;
	background-color: #bbbdde !important;
	width: 20%;
}
@media only screen and (max-width: 1024px) {
.secondary-nav-footer {
	display: flex;
	flex-direction: row;
	margin-bottom: 0px;
	background-color: #bbbdde !important;
	width: 50%;
}
}
@media only screen and (max-width: 600px) {
.secondary-nav-footer {
	display: flex;
	flex-direction: row;
	margin-bottom: 0px;
	background-color: #bbbdde !important;
	width: 100%;
}
}

.list-center {
	display: flex;
	justify-content: center;
}

.v-list-item--link:before {
	background-color: #ffffff00 !important;
}

.theme--light.v-list-item--active:hover::before,
.theme--light.v-list-item--active::before {
	opacity: 0;
}

.v-list-item__title:hover,
.v-list-item__subtitle:hover {
	color: darkblue;
	text-decoration: underline;
}

.theme--light.v-sheet{
    background-color: #bbbdde !important;
}
</style>