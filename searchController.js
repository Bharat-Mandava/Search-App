exports.search = function (req, res) {
    const resultArray = [];
    const { value } = req.query;
    if (value) {
        for (let i = 0; i < countries.length; i += 1) {
            const c = countries[i];
            if (c.name.toLowerCase().startsWith(value.toLowerCase())) {
                resultArray.push(c.country);
            }
        }
    }
    res.json(resultArray);
}