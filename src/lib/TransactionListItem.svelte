<script lang="ts">
	import { SplitType } from './_modules/types';
	import { Item, Graphic, Text, PrimaryText, SecondaryText, Meta } from '@smui/list';
	import { absRounded, timestampToShortDate } from './_modules/utils';
	import { CURRENCY_SYMBOLS } from './_modules/constants';
	import type { Transaction, Currency } from './_modules/types';
	import { getMemberAvatarURL } from '$lib/_modules/utils';
	import Tooltip, { Wrapper } from '@smui/tooltip';

	export let transaction: Transaction;
	export let onDeleteCallback: (() => void) | undefined = undefined;
	export let currency: Currency;

	$: isSettlement = !('title' in transaction && transaction.title);
	$: members = transaction.splits ? Object.keys(transaction.splits) : [];
	let open = false;
</script>

<div>
	<Item
		class={`rounded-item ${isSettlement ? 'settlement-item' : ''}`}
		on:SMUI:action={() => (open = !open)}
		nonInteractive={false}
	>
		<div style="display: flex; width: 100%; overflow-x: auto; align-items: center;">
			<Graphic style="text-align: center; width: 1.75rem; font-weight: bold; flex-shrink: 0;">
				{timestampToShortDate(transaction.timestamp)}
			</Graphic>
			{#if 'title' in transaction}
				<div style="display: flex;">
					<div>
						<Text>
							<div style="font-weight: 600;">
								{transaction.title}
							</div>
							<div style="font-size: 16px;">
								<strong>{CURRENCY_SYMBOLS[currency]}{transaction.amount}</strong> 
								paid by <strong>{transaction.paidBy}</strong>
							</div>
						</Text>
					</div>
					<div style="display: flex; align-items: center; margin-left: 15px;">
						{#each members as member (member)}
							<!-- This div is necessary to prevent crash with tooltip usage
								https://github.com/hperrin/svelte-material-ui/issues/453
							-->
							<div style="flex-shrink: 0;">
								<Wrapper>
									<Graphic 
										style="background-image: url({getMemberAvatarURL(member)}); 
										width: 1.92rem; 
										height: 1.92rem; 
										background-size: cover;" 
									/>
									<Tooltip>
										{member}
									</Tooltip>
								</Wrapper>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<Text style="justify-content: center;">
					<span style="font-weight: 600;">
						{`${transaction.paidBy} paid ${transaction.receivedBy}`}
					</span>
					<SecondaryText style="font-weight: 600; font-size: 16px;">
						{CURRENCY_SYMBOLS[currency]}{absRounded(transaction.amount)}
					</SecondaryText>
				</Text>
			{/if}
		</div>
		{#if onDeleteCallback}
			<Meta class="material-icons" on:click={onDeleteCallback}>clear</Meta>
		{/if}
	</Item>

	{#if open && 'splits' in transaction && transaction.splits}
		<div style="margin-bottom: 0.4rem;">
			{#each Object.entries(transaction.splits) as [memberName, split] (memberName)}
				<ul>
					<Text>
						{#if transaction.splitType === SplitType.Percent}
						<Text>
							<strong>{memberName}</strong>'s share is {split.toFixed(1)}% 
							<strong style="margin-left: 5px">({CURRENCY_SYMBOLS[currency]}{(transaction.amount * (split / 100)).toFixed(2)})</strong>
						</Text>
						{:else if transaction.splitType === SplitType.Amount}
							<strong>{memberName}</strong>'s share is <strong>{CURRENCY_SYMBOLS[currency]}{split.toFixed(2)}</strong>
						{/if}
					</Text>
				</ul>
			{/each}
		</div>
	{/if}
</div>
