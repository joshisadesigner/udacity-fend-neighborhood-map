const FS_CLIENT = 'SKTI3V3SYKOFYXRZ4DZOWF0VZY042TFGWY4VPF224ROTIICZ';
const FS_SECRET = 'TUQKX2TKJRN2D1G5RKBCCQQBIZUWC4UDA1RTVUS4EHUHGH2D';
// const FS_CLIENT = 'SBFLUAUT4VZHCIFUX2MCO22WCDIHO1QMPFQQ0XWB01KYHWXT';
// const FS_SECRET = 'VGXMQZMTVZWXQ0SAHXCQ5RMJZ25OEAKKQUCJBI3MABO2STVU';
const FS_VERSION = '20180115';
const FS_URL = 'https://api.foursquare.com/v2/venues/';
const FS_R = '2500';
const FS_L = '5';
const FS_CAT = '4d4b7105d754a06374d81259';

const sort = (a, b) => {
    var keyA = a.name,
        keyB = b.name;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
};

export const foursquareVenues = center => {
    let url = `${FS_URL}search?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}&categoryId=${FS_CAT}&radius=${FS_R}&ll=${center}&limit=${FS_L}`;
    let headers = new Headers();
    let request = new Request(url, {
        method: 'GET',
        headers
    });

    return fetch(request)
        .then(response => {
            if (!response.ok) {
                throw response;
            } else return response.json();
        })
        .then(result => {
            let venues = result.response.venues;
            venues.sort(sort);

            return venues;
        });
};

export const venueDetails = venue => {
    let url = `${FS_URL}${
        venue.id
    }?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}`;

    return fetch(url).then(response => {
        if (!response.ok) {
            throw response;
        } else return response.json();
    });
};
