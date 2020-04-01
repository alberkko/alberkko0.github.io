<template>
	<div>
		<News v-if="$route.params.id == 'news'"></News>
		<Resources v-if="$route.params.id == 'resources'"></Resources>
		<Tables v-if="$route.params.id == 'tables'"></Tables>
		<LegalNotice v-if="$route.params.id == 'legal-notice'"></LegalNotice>
		<TermsOfUse v-if="$route.params.id == 'terms-of-use'"></TermsOfUse>
	</div>
</template>

<script>
import News from '../components/News'
import Resources from '../components/Resources'
import Tables from '../components/Tables'
import LegalNotice from '../components/LegalNotice'
import TermsOfUse from '../components/TermsOfUse'
export default {
	components: {
		News,
		Resources,
		Tables,
		LegalNotice,
		TermsOfUse
	}
}
</script>

<style lang="scss" scoped></style>