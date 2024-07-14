import { goto } from '$app/navigation';
import GUN from 'gun';

export function redirectToGroup(groupID: string, secretKey: string) {
	goto('/g/' + groupID + secretKey);
}

export function redirectToAbout() {
	goto('/about');
}

export function getMemberAvatarURL(memberName: string, size: number = 40) {
	return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(memberName)}&backgroundColor=f7d794,f3a683,778beb,95e1d3,f8c291,a5d8d8&fontWeight=600&fontSize=40&size=${size}&backgroundType=gradientLinear&chars=2&textColor=211d1d`;
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
