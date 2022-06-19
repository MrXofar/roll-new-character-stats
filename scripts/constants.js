export const namedfields = (...fields) => {
    return (...arr) => {
        var obj = {};
        fields.forEach((field, index) => {
            obj[field] = arr[index];
        });
        return obj;
    };
};