<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import Radio from '@smui/radio';
	import LayoutGrid, { Cell, InnerGrid } from '@smui/layout-grid';
	import Select, { Option } from '@smui/select';
	import { Graphic } from '@smui/list';
	import { Currency, Expense, Member, SplitType } from './_modules/types';
	import { getMemberAvatarURL } from './_modules/utils';
	import AddExpenseSplitField from './AddExpenseSplitField.svelte';
	import { CURRENCY_SYMBOLS } from './_modules/constants';

	export let openDialog: boolean;
	export let addCallback: (expense: Expense) => void;
	export let membersList: Array<[string, Member]>;
	export let currency: Currency;

	function getInitialSplit(): Record < SplitType, Record < string, number >> {
		const numMembers = membersList.length;

		const initialAmount = (inputAmount ?? 0) / numMembers;
		const initialPercent = 100 / numMembers;

		return {
			[SplitType.Share]: membersList.reduce(
				(acc, [member]) => ({
					...acc,
					[member]: 1
				}), {}
			),
			[SplitType.Amount]: membersList.reduce(
				(acc, [member]) => ({
					...acc,
					[member]: initialAmount
				}), {}
			),
			[SplitType.Percent]: membersList.reduce(
				(acc, [member]) => ({
					...acc,
					[member]: initialPercent
				}), {}
			),
		};
	}

	const splitOptions: Array<{ name: string; value: SplitType }> = [
		{ name: 'By shares', value: SplitType.Share},
		{ name: 'By percentages', value: SplitType.Percent },
		{ name: 'By exact amounts', value: SplitType.Amount }
	];

	let inputName: string = '';
	let inputAmount: number = 0.0;
	let inputPaidBy: string = '';
	let isSplitPopulated = false;
	$: split = splitType ? getInitialSplit() : {};
	let splitType: SplitType | undefined = undefined;

	function addMember(memberKey: string) {
		split[SplitType.Share][memberKey] = 0;
		split[SplitType.Amount][memberKey] = 0;
		split[SplitType.Percent][memberKey] = 0;

		const updatedMembersCount = Object.keys(split[SplitType.Amount]).length;

		const updatedAmountSplit = {};
		const updatedPercentSplit = {};

		Object.keys(split[SplitType.Amount]).forEach(member => {
			updatedAmountSplit[member] = inputAmount / updatedMembersCount;
			updatedPercentSplit[member] = 100 / updatedMembersCount;
		});

		split[SplitType.Amount] = updatedAmountSplit;
		split[SplitType.Percent] = updatedPercentSplit;

		split = split;
	}

	function deleteMember(memberKey: string) {
		delete split[SplitType.Share][memberKey];
		delete split[SplitType.Amount][memberKey];
		delete split[SplitType.Percent][memberKey];

		const updatedMembersCount = Object.keys(split[SplitType.Amount]);
		const remainingMembersCount = updatedMembersCount.length;

		const updatedAmountSplit = {};
		const updatedPercentSplit = {};

		updatedMembersCount.forEach(member => {
			updatedAmountSplit[member] = inputAmount / remainingMembersCount;
			updatedPercentSplit[member] = 100 / remainingMembersCount;
		});

		split[SplitType.Amount] = updatedAmountSplit;
		split[SplitType.Percent] = updatedPercentSplit;

		split = split;
	}

	function setValue(memberKey: string, value: number) {
		split[splitType!][memberKey] = value;
		split = split;
	}

	function onSubmit() {
		if (!splitType) return;

		const cleanedSplits :Record<string, number> = {};
		for (const [member, value] of Object.entries(split[splitType])) {
			if (!value) continue;
			cleanedSplits[member] = Math.round(value * 100) / 100
		}

		const expense = {
			timestamp: Date.now(),
			title: inputName,
			amount: inputAmount,
			paidBy: inputPaidBy,
			splits: cleanedSplits,
			splitType,
		};
		console.log(JSON.stringify(expense, null, 2))

		addCallback(expense);

		inputName = '';
		inputAmount = 0.0;
		inputPaidBy = '';
		isSplitPopulated = false;
		split = getInitialSplit();
		splitType = undefined;
	}

	$: isValid = (() => {
		if (inputName === '') return false;
		if (isNaN(inputAmount) || inputAmount <= 0.0) return false;
		if (!inputPaidBy) return false;
		if (!splitType) return false;

		let valueTotal = 0;
		for (const value of Object.values(split[splitType])) {
			if (value < 0 || isNaN(value)) return false;
			valueTotal += value;
		}
		if (splitType === SplitType.Percent && Math.abs(100 - valueTotal) > 0.5) return false;
		if (splitType === SplitType.Amount && Math.abs(inputAmount - valueTotal) > 0.005) return false;

		return true;
	})();
</script>

<Dialog
	bind:open={openDialog}
	aria-labelledby="default-focus-title"
	aria-describedby="default-focus-content"
>
	<Title id="default-focus-title">🧾 Add Expense</Title>
	<Content id="default-focus-content">
		<LayoutGrid>
			<Cell span={12}>
				<strong>Enter description:</strong>
				<Textfield bind:value={inputName} style="width: 100%;"/>
			</Cell>
			<Cell span={12}>
				<strong>Enter amount ({CURRENCY_SYMBOLS[currency]}):</strong>
				<Textfield type="number" bind:value={inputAmount} style="width: 100%;"/>
			</Cell>
			<Cell span={12}>
				<strong>Who paid?</strong>
				<Select bind:value={inputPaidBy} class="add-expense-select" style="width: 100%">
					{#each membersList as [key, member] (key)}
						<Option value={member.name} style="font-weight: 600;">
							<Graphic
								style="background-image: url({getMemberAvatarURL(member.name, 24)});"
							/>
							{member.name}
						</Option>
					{/each}
				</Select>
			</Cell>

			<Cell span={12}>
				<strong>How should the expense be split?</strong>
				{#each splitOptions as option (option)}
				  <div style="display: flex; align-items: center; margin-top: 5px">
					<Radio
					  bind:group={splitType}
					  value={option.value}
					  on:change={() => {
						if (!isSplitPopulated) {
						  isSplitPopulated = true;
						  split = getInitialSplit();
						}
					  }}
					/>
					<span style="margin-left: 5px">{option.name}</span>
				  </div>
				{/each}
			  </Cell>

			{#if splitType}
				<AddExpenseSplitField
					{membersList}
					{currency}
					{splitType}
					{split}
					{addMember}
					{deleteMember}
					{setValue}
				/>
			{/if}
		</LayoutGrid>
	</Content>
	<Actions>
		<Button>
			<Label>cancel</Label>
		</Button>
		<Button
			variant="unelevated"
			disabled={!isValid}
			on:click={onSubmit}
		>
			<Label>add</Label>
		</Button>
	</Actions>
</Dialog>