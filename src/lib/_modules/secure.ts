import { getSEA } from './initGun';
import { redirectToError } from './utils';

const SEA = getSEA();

export async function putSecure(
	node: any,
	payload: any,
	secretKey: string,
	callback: Function
) {
	let secretPayload = await SEA.encrypt(payload, secretKey);
	node.put(secretPayload, callback);
}

export async function deleteSecure(node: any, callback: Function) {
	node.put(null, callback);
}

export async function onSecure(node: any, secretKey: string, callback: any, emptyCallback: any) {
	node.on(async (data: any, key: any) => {
		if (data) {
			let plain = await handleDecrypt(data, secretKey);
			callback(plain, key);
		} else {
			emptyCallback(key);
		}
	});
}

async function handleDecrypt(payload: any, secretKey: string) {
	let res = undefined;
	res = await SEA.decrypt(payload, secretKey);
	if (!res) {
		console.error('Error decrypting payload, showing error...', SEA.err);
		redirectToError(
			'wrong key on URL, please check if you copied the link correctly and try again'
		);
	}
	return res;
}

export async function setSecure(node, payload: any, secretKey: string) {
	let secretPayload = await SEA.encrypt(payload, secretKey);
	node.set(secretPayload);
}
