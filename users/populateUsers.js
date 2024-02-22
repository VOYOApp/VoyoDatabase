const axios = require('axios');
const fs = require('fs');
const GOOGLE_PLACES_API_KEY = 'AIzaSyBznSC8S1mPU-GPjsxuagQqnNK3a8xVOl4'; // Replace with your API key

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

        console.log(response.data)

        if (response.data.status === 'OK' && response.data.candidates.length > 0) {
            console.log(`Address ${location} has place_id ${response.data.candidates[0].place_id}`);
            console.log(response.data.candidates)
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



const processUser = async (user) => {

    console.log(user)
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
        await axios.post('http://127.0.0.1:3000/inscription', {
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
};

const processUsers = async () => {
    try {
        const data = await readFileAsync('users.json');
        const users = data.results;
        console.log(`Processing ${users.length} users...`);
        for (const user of users) {
            await processUser(user);
        }
    } catch (error) {
        console.error(`Error reading the file: ${error.message}`);
    }
};

// Start processing users
processUsers();
