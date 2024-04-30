<script lang="ts">
	import List, { Item, Text, PrimaryText, SecondaryText, Graphic } from '@smui/list';
	import { absRounded, getMemberAvatarURL } from './_modules/utils';
	export let pendingPayments: Array<any> = [];
	export let payerName = '';
	export let showRecordPaymentCallback: Function;
</script>

<List twoLine style="margin-left: 30px; margin-bottom: 10px;">
	{#if pendingPayments.length === 0}
		<Text style="font-weight: semi-bold; font-size: 16px;">No outstanding payments 😄</Text>
	{:else}
		{#each pendingPayments as [receiverName, debtAmount]}
			<Item on:click={() => showRecordPaymentCallback(receiverName, debtAmount, payerName)}>
				<Text>
					<PrimaryText><span style="color: gray">needs to pay</span> {receiverName}</PrimaryText>
					<SecondaryText style="font-weight: bold; font-size: 16px;" class="error-text">${absRounded(debtAmount)}</SecondaryText>
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
