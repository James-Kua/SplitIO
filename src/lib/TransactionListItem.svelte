<script lang="ts">
	import { Item, Graphic, Text, PrimaryText, SecondaryText, Meta } from '@smui/list';
	import { absRounded, timestampToShortDate } from './_modules/utils';

	export let transaction = {};
	export let onDeleteCallback: Function | undefined = undefined;

	$: isSettlement = transaction.title === undefined;
</script>

<div>
	<Item class={`rounded-item ${isSettlement ? 'settlement-item' : ''}`}>
		<Graphic style="text-align: center; width: 1.75rem; font-weight: bold">
			{timestampToShortDate(transaction.timestamp)}
		</Graphic>
		{#if !isSettlement}
			<Text>
				<PrimaryText style="font-weight: 600;">{transaction.title}</PrimaryText>
				<SecondaryText style="font-size: 16px"><strong>${transaction.amount}</strong> paid by {transaction.paidBy}</SecondaryText>
			</Text>
		{:else}
		<Text>
			<PrimaryText style="font-weight: 600;">
			  {`${transaction.paidBy} paid ${transaction.receivedBy}`}
			</PrimaryText>
			<SecondaryText style="font-weight: 600; font-size: 16px;">${absRounded(transaction.amount)}</SecondaryText>
		  </Text>
		{/if}
		{#if onDeleteCallback}
			<Meta class="material-icons" on:click={onDeleteCallback}>clear</Meta>
		{/if}
	</Item>
</div>
