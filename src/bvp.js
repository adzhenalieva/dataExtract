const axios = require('axios');
const cheerio = require('cheerio');


const getData = async (sourceURL) => {
    let response;
    try {
        response = await axios.get(sourceURL);
    } catch (e) {
        if (e.response) {
            const rError = e.response;
            console.log('Data source responded with an error code %s, message: \'%s\'', rError.status, rError.statusText);
        } else if (e.request) {
            console.log('No response received from the data source endpoint');
        } else {
            console.log('Error while composing a request to the data source');
        }
        process.exit(1);
    }
    const $ = cheerio.load(response.data, {
        normalizeWhitespace: true,
    });

    const dataArray = [];
    $('.details')
        .each((i, elem) => {
            dataArray[i] = $(elem)
                .text()
                .toString()
                .trim()

        });

    dataArray.join(', ');
    return dataArray;
};

const transformData = (data) => data.map((i) => {
    return {
        source: '',
        company: '',
        url: '',
}
    ;
});

(async () => {
    const sourceURL = 'https://www.bvp.com/companies#all';
    const data = await getData(sourceURL);

    const transformedData = await transformData(data);
})();
