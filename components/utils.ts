// utils.ts
export function hexToUint8Array(hexString: string): Uint8Array {
    if (hexString.length % 2 !== 0) {
        throw new Error("Hex string must have an even number of characters");
    }

    const byteArray = new Uint8Array(hexString.length / 2);

    for (let i = 0; i < hexString.length; i += 2) {
        byteArray[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
    }

    return byteArray;
}

export function encodeHex(buffer: Uint8Array): string {
    return buffer.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}