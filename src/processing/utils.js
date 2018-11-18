export const join = (input, btwn) =>
    input.reduce((acc, val, idx, arr) => {
        const addedVal = acc.concat(val);

        if (idx < arr.length - 1) {
            return addedVal.concat(btwn);
        }

        return addedVal;
    }, []);

export const randomHex = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);

export const required = (name) => { throw new TypeError(`${name} is a required parameter`) };

