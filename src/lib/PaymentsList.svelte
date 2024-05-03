<script lang="ts">
	import List, { Item, Text, PrimaryText, SecondaryText, Graphic } from '@smui/list';
	import { absRounded, getMemberAvatarURL } from './_modules/utils';
	import { CURRENCY_SYMBOLS } from './_modules/constants';
	export let pendingPayments: Array<any> = [];
	export let payerName = '';
	export let showRecordPaymentCallback: Function;
	export let currency: string;
</script>

<List twoLine style="margin-left: 30px; margin-bottom: 10px;">
	{#if pendingPayments.length === 0}
		<SecondaryText style="font-weight: semi-bold;">No outstanding payments 😄</SecondaryText>
	{:else}
		{#each pendingPayments as [receiverName, debtAmount] (receiverName)}
			<Item on:click={() => showRecordPaymentCallback(receiverName, debtAmount, payerName)}>
				<Text>
					<PrimaryText><span style="color: gray;">needs to pay</span> {receiverName}</PrimaryText>
					<SecondaryText style="font-weight: bold; font-size: 16px;" class="error-text">{CURRENCY_SYMBOLS[currency]}{absRounded(debtAmount)}</SecondaryText>
				</Text>
				<Graphic
					style="margin-left: auto; margin-right: 0; background-image: url({getMemberAvatarURL(
						receiverName
					)});"
				/>
			</Item>
		{/each}
	{/if}
</List>
