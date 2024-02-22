const axios = require('axios');
const fs = require('fs');

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

const processUser = async (user) => {


    const phoneNumber = '+33' + user.cell.replaceAll('-', '').substring(1);
    const firstName = user.name.first;
    const lastName = user.name.last;
    const email = user.email;
    const password = user.login.password;
    const roleId = getRandomRoleId();
    const bio = '';
    const profilePicture = user.picture.medium;
    const pricing = getRandomPrice();
    const addressId = 'fefe';
    const radius = getRandomRadius();

    try {
        await axios.post('https://decent-tarpon-manually.ngrok-free.app/register', {
            phone_number: phoneNumber,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            role_id: roleId,
            biography: bio,
            profile_picture: profilePicture,
            // pricing: pricing,
            address_id: addressId,
            // radius: radius,
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

        for (const user of users) {
            await processUser(user);
        }
    } catch (error) {
        console.error(`Error reading the file: ${error.message}`);
    }
};

// Start processing users
processUsers();
