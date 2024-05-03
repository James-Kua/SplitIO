<script lang="ts">
	import { SplitType } from './_modules/types';
	import { Item, Graphic, Text, PrimaryText, SecondaryText, Meta } from '@smui/list';
	import { absRounded, timestampToShortDate } from './_modules/utils';
	import { CURRENCY_SYMBOLS } from './_modules/constants';
	import type { Transaction, Currency } from './_modules/types';
	import { getMemberAvatarURL } from '$lib/_modules/utils';

	export let transaction: Transaction;
	export let onDeleteCallback: (() => void) | undefined = undefined;
	export let currency: Currency;

	$: isSettlement = !('title' in transaction && transaction.title);
	let members = transaction.splits ? Object.keys(transaction.splits) : [];
	let open = false;
</script>

<div>
	<Item
		class={`rounded-item ${isSettlement ? 'settlement-item' : ''}`}
		on:SMUI:action={() => (open = !open)}
		nonInteractive={false}
	>
		<Graphic style="text-align: center; width: 1.75rem; font-weight: bold">
			{timestampToShortDate(transaction.timestamp)}
		</Graphic>
		{#if 'title' in transaction}
			<div>
				<Text>
					<div style="font-weight: 600; white-space: nowrap;">
						{transaction.title}
					</div>
					<div style="font-size: 16px; white-space: nowrap;">
						<strong>{CURRENCY_SYMBOLS[currency]}{transaction.amount}</strong> 
						paid by <strong>{transaction.paidBy}</strong>
					</div>
				</Text>
			</div>

			<div style="display: flex; overflow-x: auto; margin-left: 15px;">
				{#each members as member}
					<Graphic 
						style="background-image: url({getMemberAvatarURL(member)}); 
						width: 1.65rem; 
						height: 1.65rem; 
						background-size: cover; 
						border-radius: 30%;" 
					/>
				{/each}
			</div>
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
		<ul style="margin-bottom: 0.4rem;">
			{#each Object.entries(transaction.splits) as [memberName, split]}
				<ul>
					<Text>
						{#if transaction.splitType === SplitType.Percent}
							<strong>{memberName}</strong>'s share is <strong>{split.toFixed(1)}%</strong>
						{:else if transaction.splitType === SplitType.Amount}
							<strong>{memberName}</strong>'s share is <strong>{CURRENCY_SYMBOLS[currency]}{split.toFixed(2)}</strong>
						{/if}
					</Text>
				</ul>
			{/each}
		</ul>
	{/if}
</div>