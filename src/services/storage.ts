
const saveObject = (key: string, obj: object) => {
	window.localStorage.setItem(key, JSON.stringify(obj));
}

const getObject = async (key: string) => {
	const item = window.localStorage.getItem(key);
	return item ? JSON.parse(item) : null;
}

export { saveObject, getObject }
