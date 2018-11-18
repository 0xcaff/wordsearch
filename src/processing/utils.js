export const join = (input, btwn) =>
    input.reduce((acc, val, idx, arr) => {
        const addedVal = acc.concat(val);

        if (idx < arr.length - 1) {
            return addedVal.concat(btwn);
        }

        return addedVal;
    }, []);
