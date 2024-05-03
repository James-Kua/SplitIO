<script lang="ts">
	import { SplitType } from './_modules/types';
	import { Item, Graphic, Text, PrimaryText, SecondaryText, Meta } from '@smui/list';
	import { absRounded, timestampToShortDate } from './_modules/utils';
	import { CURRENCY_SYMBOLS } from './_modules/constants';
	import type { Transaction, Currency } from './_modules/types';

	export let transaction: Transaction;
	export let onDeleteCallback: (() => void) | undefined = undefined;
	export let currency: Currency;

	$: isSettlement = !('title' in transaction && transaction.title);
	let open = false;
</script>

<div>
	<Item
		class={`rounded-item ${isSettlement ? 'settlement-item' : ''}`}
		on:SMUI:action={() => (open = !open)}
		nonInteractive={false}
	>
		<Graphic style="text-align: center; width: 1.75rem;">
			{timestampToShortDate(transaction.timestamp)}
		</Graphic>
		{#if 'title' in transaction}
			<Text>
				<PrimaryText>{transaction.title}</PrimaryText>
				<SecondaryText style="font-size: 16px"><strong>{CURRENCY_SYMBOLS[currency]}{transaction.amount}</strong> paid by {transaction.paidBy}</SecondaryText>
			</Text>
		{:else}
		<Text>
			<PrimaryText style="font-weight: 600;">
			  {`${transaction.paidBy} paid ${transaction.receivedBy}`}
			</PrimaryText>
			<SecondaryText style="font-weight: 600; font-size: 16px;">{CURRENCY_SYMBOLS[currency]}{absRounded(transaction.amount)}</SecondaryText>
		  </Text>
		{/if}
		{#if onDeleteCallback}
			<Meta class="material-icons" on:click={onDeleteCallback}>clear</Meta>
		{/if}
	</Item>

	{#if open && 'splits' in transaction && transaction.splits}
		<ul>
			{#each Object.entries(transaction.splits) as [memberName, split]}
				<ul>
					<Text>
						{#if transaction.splitType === SplitType.Percent}
							{memberName}'s share was <strong>{split.toFixed(2)}%</strong>
						{:else if transaction.splitType === SplitType.Amount}
							{memberName}'s share was <strong>{split.toFixed(2)}</strong>
						{/if}
					</Text>
				</ul>
			{/each}
		</ul>
	{/if}
</div>