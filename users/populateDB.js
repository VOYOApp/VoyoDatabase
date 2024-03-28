const axios = require('axios');
const fs = require('fs');
const faker = require('faker');

const NUMBER_OF_USERS = 15; // Max => 1000
const NUMBER_OF_AVAILABILITIES_MAX = 10;
const NUMBER_OF_CRITERIA_MAX = 5;


const GOOGLE_PLACES_API_KEY = 'AIzaSyBznSC8S1mPU-GPjsxuagQqnNK3a8xVOl4'; // Replace with your API key
const URL = 'http://localhost:3000';

const readFileAsync = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

const getRandomRoleId = () => Math.floor(Math.random() * 2) + 1;
const getRandomPrice = () => (Math.random() * (15.99 - 5.5) + 5.5).toFixed(2);
const getRandomRadius = () => Math.floor(Math.random() * (10000 - 200 + 1) + 200);
const getAddressId = async (location) => {

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json`, {
            params: {
                input: location, inputtype: 'textquery', fields: 'place_id', key: GOOGLE_PLACES_API_KEY,
            },
        });


        if (response.data.status === 'OK' && response.data.candidates.length > 0) {
            return response.data.candidates[0].place_id;
        }
    } catch (error) {
        console.error(`Error getting address_id for address ${location}: ${error.message}`);
    }

    return null;
};
const retrieveUserPassword = async (email) => {
    // Open the users.json file and retrieve the password of the user with the given email
    try {
        const data = await readFileAsync('users.json');
        const user = data.results.find(user => user.email === email);
        return user ? user.login.password : null;
    } catch (error) {
        console.error(`Error reading the file: ${error.message}`);
    }
}

// const userLogging = async (user) => {
//     const email = user.email
//     const password = await retrieveUserPassword(email);
//
//     try {
//         const requestOptions = {
//             method: "GET", redirect: "follow"
//         };
//
//         fetch(`${URL}/api/user/login?email=${email}&password=${password}`, requestOptions)
//             .then((response) => response.text())
//             .then((result) => console.log(JSON.parse(result).token))
//             .catch((error) => console.error(error));
//
//
//     } catch (error) {
//         console.error(`Error logging in user ${email}: ${error.message}`);
//     }
//
//     return null;
//
// }

const getAddressData = async (location) => {

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json`, {
            params: {
                input: location, inputtype: 'textquery', fields: 'place_id', key: GOOGLE_PLACES_API_KEY,
            },
        });


        if (response.data.status === 'OK' && response.data.candidates.length > 0) {
            return {
                place_id: response.data.candidates[0].place_id,
                x: response.data.candidates[0].geometry.location.lat,
                y: response.data.candidates[0].geometry.location.lng
            };
        }
    } catch (error) {
        console.error(`Error getting address_id for address ${location}: ${error.message}`);
    }

    return null;
};

const getRandomAddress = (filename) => {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const addresses = JSON.parse(data);

        if (addresses.length > 0) {
            const randomIndex = Math.floor(Math.random() * addresses.length);
            return addresses[randomIndex].adresse;
        } else {
            console.error('The JSON file is empty.');
            return null;
        }
    } catch (error) {
        console.error('Error reading the JSON file:', error.message);
        return null;
    }
};

const createUser = async (user) => {
    const phoneNumber = '+33' + user.cell.replaceAll('-', '').substring(1);
    const firstName = user.name.first;
    const lastName = user.name.last;
    const email = user.email;
    const password = user.login.password;
    const roleId = getRandomRoleId();
    const bio = faker.lorem.words();
    const profilePicture = user.picture.medium;
    let pricing = 0
    let randomAddress = ""
    let addressId = ""
    let radius = 0
    if (roleId === 1) {
        pricing = parseFloat(getRandomPrice());
        randomAddress = getRandomAddress("addres0726.json");
        addressId = await getAddressId(randomAddress);
        radius = getRandomRadius();
    }

    try {
        await axios.post(`${URL}/api/user`, {
            phone_number: phoneNumber,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            role_id: roleId,
            biography: bio,
            profile_picture: profilePicture,
            pricing: pricing,
            address_id: addressId,
            radius: radius,
        });

        console.log(`User ${firstName} ${lastName} processed successfully.`);
    } catch (error) {
        console.error(`Error processing user ${firstName} ${lastName}: ${error.message}`);
        console.error({
            phone_number: phoneNumber,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            role_id: roleId,
            biography: bio,
            profile_picture: profilePicture,
            pricing: pricing,
            address_id: addressId,
            radius: radius,
        });
    }
}

const createRandomAvailability = async (userId) => {
    // Create a random date and time on the first week of February 2024
    const year = 2024;
    const month = 1; // February
    const day = Math.floor(Math.random() * 7) + 1;
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const date = new Date(year, month, day, hour, minute);
    const availability = date.toISOString();

    // Create a random duration between 1 and 12 hours
    const duration = `${Math.floor(Math.random() * 12) + 1}h`;

    // Create a random repeat pattern (DAILY, WEEKLY, MONTHLY, YEARLY, null)
    const repeatPattern = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', null][Math.floor(Math.random() * 5)];


    try {
        await axios.post(`${URL}/api/availability`, {
            phone_number: userId, availability, duration, repeat: repeatPattern,
        });
    } catch (error) {
        console.error(`Error creating availability for user ${userId}: ${error.message}`);
    }
}

const processUser = async (user) => {
    try {
        await createUser(user);
        // Create between 1 and 5 random availabilities for the user
        const numberOfAvailabilities = Math.floor(Math.random() * NUMBER_OF_AVAILABILITIES_MAX) + 1;
        for (let i = 0; i < numberOfAvailabilities; i++) {
            await createRandomAvailability('+33' + user.cell.replaceAll('-', '').substring(1));
        }
    } catch (error) {
        console.error(`Error processing user: ${error.message}`);
    }
};

const createRandomVisits = async () => {
    // 1) Get all the users
    const response = await axios.get(`${URL}/api/user`);
    const users = response.data;

    // 2) Create random visits
    console.log('Creating random visits...');


    for (const user of users) {
        const numberOfVisits = Math.floor(Math.random() * 20) + 3; // Random number of visits between 1 and 10

        for (let i = 0; i < numberOfVisits; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)]; // Random user from the list

            const randomREID = await getAddressData(getRandomAddress("addres0726.json"));

            const visitData = {
                phone_number_prospect: user.phone_number,
                phone_number_visitor: randomUser.phone_number,
                randomREID,
                verification_code: Math.floor(Math.random() * 999999) + 100000,
                start_time: faker.date.future(),
                price: Math.floor(Math.random() * 40) + 10,
                type_real_estate: Math.floor(Math.random() * 5) + 1,
                status: faker.random.arrayElement(['PENDING', 'ACCEPTED', 'REFUSED', 'CANCELED', 'DONE']),
                note: parseInt((Math.random() * (5 - 0.1) + 0.1).toFixed(1)),
                criterias: []
            };


            // 3) Post the random visits to the API
            try {
                const response = await axios.post(`${URL}/api/visit`, visitData);
                console.log('Random visits created successfully:', response.data);
            } catch (error) {
                console.error('Error creating random visits:', error.response ? error.response.data : error.message);
            }
        }
    }
}

const createRandomCriteria = async () => {
    // 1) Get all the users
    const response = await axios.get(`${URL}/api/user`);
    const users = response.data;

    // 2) Create random criteria
    for (const user of users) {
        const email = user.email
        const password = await retrieveUserPassword(email);

        try {
            const requestOptions = {
                method: "GET", redirect: "follow"
            };

            fetch(`${URL}/api/user/login?email=${email}&password=${password}`, requestOptions)
                .then((response) => response.text())
                .then(async (result) => {
                    const numberOfCriteria = Math.floor(Math.random() * NUMBER_OF_CRITERIA_MAX) + 1;

                    for (let i = 0; i < numberOfCriteria; i++) {
                        const criteriaData = {
                            phone_number: user.phone_number,
                            criteria: faker.lorem.words(),
                            photo_required: faker.datatype.boolean(),
                            video_required: faker.datatype.boolean(),
                            reusable: true,
                        };

                        try {
                            const response = await axios.post(`${URL}/api/criteria`, criteriaData, {
                                headers: {
                                    "Authorization": `Bearer ${JSON.parse(result).token}`
                                }
                            })
                            console.log('Random criteria created successfully:', response.data);
                        } catch (error) {
                            console.error('Error creating random criteria:', error.response ? error.response.data : error.message);
                            // console.error(criteriaData);
                        }
                    }
                })
                .catch((error) => console.error(error));


        } catch (error) {
            console.error(`Error logging in user ${email}: ${error.message}`);
        }
    }
}


async function linkCriteriaAndVisits() {
    try {
        // Step 1: Get all visits
        const visitsResponse = await axios.get(`${URL}/api/visit`);
        const visits = visitsResponse.data;

        // Step 2: Get all criterias
        const criteriasResponse = await axios.get(`${URL}/api/criteria`);
        const criterias = criteriasResponse.data;

        // Step 3: Link criterias to visits
        for (const visit of visits) {
            const matchingCriterias = criterias.filter(criteria => criteria.phone_number === visit.phone_number_prospect);

            // Assign between 1 and 10 random criterias to the visit
            const randomNumberOfCriterias = Math.floor(Math.random() * 10) + 1;
            const selectedCriterias = getRandomElements(matchingCriterias, randomNumberOfCriterias);

            // console.log(visit.idVisit, selectedCriterias)

            // Assuming you have an API endpoint to link criterias to visits
            await linkCriteriasToVisit(visit.id, selectedCriterias);
        }

        console.log('Linking completed successfully');
    } catch (error) {
        console.error('Error linking criterias and visits:', error.message);
    }
}

// Helper function to get a random subset of elements from an array
function getRandomElements(array, num) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// Assuming you have an API endpoint to link criterias to visits
async function linkCriteriasToVisit(visitId, criterias) {
    try {

        for (const criteria of criterias) {
            // Use your API endpoint to link criterias to the visit
            await axios.post(`${URL}/api/linkCriteriaVisit`, {
                idVisit: visitId, idCriteria: criteria.id,
            });
        }


        console.log(`Criterias linked to visit ${visitId}`);
    } catch (error) {
        console.error(`Error linking criterias to visit ${visitId}:`, error.message);
    }
}

const processUsers = async () => {
    try {
        // const data = await readFileAsync('users.json');
        // const users = data.results;
        // console.log(`Processing ${NUMBER_OF_USERS} users...`);
        // for (let i = 0; i < NUMBER_OF_USERS; i++) {
        //     await processUser(users[i]);
        // }

        await createRandomCriteria();

        // await createRandomVisits();
    } catch (error) {
        console.error(`Error reading the file: ${error.message}`);
    }
};

// Start processing users
processUsers();
