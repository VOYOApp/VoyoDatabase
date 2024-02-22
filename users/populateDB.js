const axios = require('axios');
const fs = require('fs');

const NUMBER_OF_USERS = 30; // Max => 5000
const NUMBER_OF_AVAILABILITIES_MAX = 3; // This is the maximum number of availabilities that will be created for each user


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

const processUsers = async () => {
    try {
        const data = await readFileAsync('users.json');
        const users = data.results;
        console.log(`Processing ${NUMBER_OF_USERS} users...`);
        for (let i = 0; i < NUMBER_OF_USERS; i++) {
            await processUser(users[i]);
        }
    } catch (error) {
        console.error(`Error reading the file: ${error.message}`);
    }
};

// Start processing users
processUsers();
