<template>
	<div id="copyright-watermark" style="display:none;" :class="tourmode ? 'right-pos' : ''">
		www.ironatlas.com
		<strong class="cw-comp d-block">2019 Vifor Pharma</strong>
		{{ $t('cp_watermark') }}
	</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'CopyrightWatermark',
	computed: {
		...mapState(['tourmode'])
	}
}
</script>

<style lang="scss">
#copyright-watermark {
	text-align: right;
	position: fixed;
	bottom: 0;
	right: 50px;
	width: 200px;
	padding: 10px;
	background: rgb(255, 255, 255);
	background: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0) 0%,
		rgba(255, 255, 255, 0.5) 100%
	);
	font-size: 9px;
	.cw-comp {
		font-size: 11px;
	}
	&.right-pos {
		right: 0;
	}
	.mobile-view & {
		right: 0;
	}
}
</style>
