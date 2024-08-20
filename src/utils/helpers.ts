export const ifNotExistThrowErr = (item: string | undefined, itemName: string) => {
	if (!item) {
		throw new Error(`${itemName} must be defined!`)
	}
}