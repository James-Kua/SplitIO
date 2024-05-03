<script lang="ts">
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import Textfield from '@smui/textfield';
	import { PLACEHOLDER_GROUP_NAME } from './_modules/constants';
	import Select, { Option } from '@smui/select';
	import { CURRENCY_SYMBOLS } from './_modules/constants'
	import type { Currency } from './_modules/types'

	export let openDialog: boolean = false;
	export let addCallback: (name: string, currency: Currency) => void;

	let inputName: string = '';

	let options = Object.keys(CURRENCY_SYMBOLS) as Currency[]
	let currency: Currency = 'SGD'
</script>


<Dialog
	bind:open={openDialog}
	aria-labelledby="default-focus-title"
	aria-describedby="default-focus-content"
>
	<Title id="default-focus-title">✨ Create a new group</Title>
	<Content id="default-focus-content" style="min-height: 350px;">
		<div>
			Please enter a group name:
			<Textfield bind:value={inputName} style="width: 100%"/>
		</div>

		<div style="margin-top: 12px"> 
			<Select bind:value={currency} label="Currency (all expenses will be in this currency)" style="width: 100%;">
				{#each options as option (option)}
					<Option value={option}>
						<strong>{option}</strong>({CURRENCY_SYMBOLS[option]})
					</Option>
				{/each}
			</Select>
		</div>
	</Content>
	<Actions>
		<Button>
			<Label>cancel</Label>
		</Button>
		<Button
			variant="unelevated"
			disabled={inputName === '' || inputName === PLACEHOLDER_GROUP_NAME}
			on:click={() => {
				addCallback(inputName, currency);
				inputName = '';
			}}
		>
			<Label>Create</Label>
		</Button>
	</Actions>
</Dialog>