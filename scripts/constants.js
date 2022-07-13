export const namedfields = (...fields) => {
    return (...arr) => {
        let obj = {};
        fields.forEach((field, index) => {
            obj[field] = arr[index];
        });
        return obj;
    };
};