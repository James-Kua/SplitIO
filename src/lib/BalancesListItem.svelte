<script lang="ts">
	import { Item, Text, PrimaryText, SecondaryText, Meta, Graphic } from '@smui/list';
	import { absRounded, getMemberAvatarURL } from './_modules/utils';
	import { CURRENCY_SYMBOLS } from './_modules/constants';

	export let payerName = '';
	export let amount = 0.0;
	export let isExpanded = false;
	export let onClickCallback = () => {};
	export let currency: string;
</script>

<Item on:click={onClickCallback}>
	<Graphic style="background-image: url({getMemberAvatarURL(payerName)});" />
	<Text>
		<PrimaryText style="font-weight: bold">{payerName}</PrimaryText>
		{#if amount !== 0.0}
			<SecondaryText class={amount < 0 ? 'error-text' : 'success-text'}>
				{amount < 0 ? 'owes' : 'to receive'} {CURRENCY_SYMBOLS[currency]}{absRounded(amount)}
			</SecondaryText>
		{:else}
			<SecondaryText>
				No outstanding payments
			</SecondaryText>
		{/if}
	</Text>
	<Meta class="material-icons">{isExpanded ? 'expand_less' : 'expand_more'}</Meta>
</Item>
