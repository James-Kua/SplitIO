import { goto } from '$app/navigation';
import GUN from 'gun';

export function redirectToGroup(groupID: string, secretKey: string) {
	goto('/g/' + groupID + secretKey);
}

export function redirectToAbout() {
	goto('/about');
}

export function getMemberAvatarURL(memberName: string, size: number = 40) {
    return `https://source.boringavatars.com/beam/${size}/${encodeURIComponent(
        memberName
    )}?colors=BDB2A0,D4C0AC,9DBDBE,D9B187,CBB66D`;
}

export function getExpenseTimestamp(expenseObject: any) {
	return GUN.state.is(expenseObject, 'amount'); // get the internal timestamp for the amount property.
}

export function absRounded(num: number): string {
	return Math.abs(num).toFixed(2);
}

export function timestampToShortDate(timestamp: number) {
	return new Date(timestamp).toLocaleString('en', { month: 'short', day: 'numeric' }).toLocaleString();
}

export function redirectToError(msg: string) {
	window.location.href = `/error?msg=${msg}`;
}
