<template>
	<div>
		<LegalNotice v-if="$route.params.id == 'legal-notice'"></LegalNotice>
		<TermsOfUse v-if="$route.params.id == 'terms-of-use'"></TermsOfUse>
	</div>
</template>

<script>
import LegalNotice from '../components/LegalNotice'
import TermsOfUse from '../components/TermsOfUse'
export default {
	components: {
		LegalNotice,
		TermsOfUse
	}
}
</script>

<style lang="scss" scoped></style>