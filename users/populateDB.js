const axios = require('axios');
const fs = require('fs');
const faker = require('faker');

const NUMBER_OF_USERS = 30; // Max => 5000
const NUMBER_OF_AVAILABILITIES_MAX = 3; // This is the maximum number of availabilities that will be created for each user
const NUMBER_OF_CRITERIA_MAX = 3; // This is the maximum number of availabilities that will be created for each user


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
    const bio = '';
    const profilePicture = user.picture.medium;
    const pricing = parseFloat(getRandomPrice());
    const randomAddress = getRandomAddress("addres0726.json");
    const addressId = await getAddressId(randomAddress);
    const radius = getRandomRadius();

    try {
        await axios.post(`${URL}/inscription`, {
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
        await axios.post(`${URL}/availability`, {
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

const createRealEstate = async () => {
    // 1) Get all the users
    const response = await axios.get(`${URL}/user`);
    const users = response.data;

    // 2) Create Real Estate
    console.log('Creating real estate...');

    for (const user of users) {
        const realEstateData = {
            address_id: user.address_id,
            type_id: Math.floor(Math.random() * 5) + 1,
        };

        // 3) Post the real estate to the API
        try {
            const response = await axios.post(`${URL}/realestate`, realEstateData);
            console.log('Real estate created successfully:', response.data);
        } catch (error) {
            console.error('Error creating real estate:', error.response ? error.response.data : error.message);
        }

    }
}
const createRandomVisits = async () => {
    // 1) Get all the users
    const response = await axios.get(`${URL}/user`);
    const users = response.data;

    // 2) Create random visits
    console.log('Creating random visits...');


    // 1) Get all the users
    const responseRE = await axios.get(`${URL}/realestate`);
    const re = responseRE.data;

    for (const user of users) {
        const numberOfVisits = Math.floor(Math.random() * 10) + 1; // Random number of visits between 1 and 10

        for (let i = 0; i < numberOfVisits; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)]; // Random user from the list

            const randomREID = re[Math.floor(Math.random() * re.length)].id;

            const visitData = {
                phone_number_prospect: user.phone_number,
                phone_number_visitor: randomUser.phone_number,
                real_estate_id: randomREID,
                verification_code: Math.floor(Math.random() * 999999) + 100000,
                start_time: faker.date.future(), // Example: Generating a random future date
                price: Math.floor(Math.random() * 40) + 10, // Example: Generating a random price between 50 and 200
                status: faker.random.arrayElement(['PENDING', 'ACCEPTED', 'REFUSED', 'CANCELED', 'DONE']),
                note: parseInt((Math.random() * (5 - 0.1) + 0.1).toFixed(1))
            };


            // 3) Post the random visits to the API
            try {
                const response = await axios.post(`${URL}/visit`, visitData);
                console.log('Random visits created successfully:', response.data);
            } catch (error) {
                console.error('Error creating random visits:', error.response ? error.response.data : error.message);
            }
        }
    }
}

const createRandomCriteria = async () => {
    // 1) Get all the users
    const response = await axios.get(`${URL}/user`);
    const users = response.data;

    // 2) Create random criteria
    console.log('Creating random criteria...');

    for (const user of users) {
        const numberOfCriteria = Math.floor(Math.random() * NUMBER_OF_CRITERIA_MAX) + 1;

        for (let i = 0; i < numberOfCriteria; i++) {
            const criteriaData = {
                phone_number: user.phone_number,
                criteria: faker.lorem.words(),
                criteria_answer: faker.lorem.words(),
                photo_required: faker.datatype.boolean(),
                photo: `https://picsum.photos/2000/1400`,
                video_required: faker.datatype.boolean(),
                video: `https://picsum.photos/2000/1400`, // There is no random video api around there
                reusable: faker.datatype.boolean(),
            };

            // 3) Post the random criteria to the API
            try {
                const response = await axios.post(`${URL}/criteria`, criteriaData);
                console.log('Random criteria created successfully:', response.data);
            } catch (error) {
                console.error('Error creating random criteria:', error.response ? error.response.data : error.message);
                console.error(criteriaData);
            }
        }
    }



}


// async function linkCriteriaAndVisits() {
//     try {
//         // Step 1: Get all visits
//         const visitsResponse = await axios.get(`${URL}/visit`);
//         const visits = visitsResponse.data;
//         console.log('Linking completed successfully');
//     } catch (error) {
//         console.error('Error linking criterias and visits:', error.message);
//     }
// }
//
// // Helper function to get a random subset of elements from an array
// function getRandomElements(array, num) {
//     const shuffled = array.sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, num);
// }
//
// // Assuming you have an API endpoint to link criterias to visits
// async function linkCriteriasToVisit(visitId, criterias) {
//     try {
//         // Use your API endpoint to link criterias to the visit
//         await axios.post(`${URL}/linkCriteriaVisit`, {
//             idVisit: visitId,
//             criterias: criterias.map(criteria => criteria.idCriteria),
//         });
//
//         console.log(`Criterias linked to visit ${visitId}`);
//     } catch (error) {
//         console.error(`Error linking criterias to visit ${visitId}:`, error.message);
//     }
// }
const processUsers = async () => {
    try {
        const data = await readFileAsync('users.json');
        const users = data.results;
        console.log(`Processing ${NUMBER_OF_USERS} users...`);
        for (let i = 0; i < NUMBER_OF_USERS; i++) {
            await processUser(users[i]);
        }

        await createRealEstate();

        await createRandomVisits();

        await createRandomCriteria();

        // await linkCriteriaAndVisits();
    } catch (error) {
        console.error(`Error reading the file: ${error.message}`);
    }
};

// Start processing users
processUsers();
