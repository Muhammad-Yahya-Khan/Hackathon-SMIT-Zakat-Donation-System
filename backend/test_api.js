const axios = require("axios");

async function test() {
    try {
        // Login
        console.log("Logging in...");
        const loginRes = await axios.post(
            "http://localhost:5000/api/auth/login",
            {
                email: "admin@zakat.com",
                password: "admin123",
            }
        );
        const token = loginRes.data.token;
        console.log("Token received");

        // Get Users
        console.log("Fetching users...");
        const usersRes = await axios.get(
            "http://localhost:5000/api/admin/users",
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log("Users fetched:", usersRes.data.length);
        console.log(
            "Data type:",
            Array.isArray(usersRes.data) ? "Array" : typeof usersRes.data
        );
    } catch (error) {
        console.error(
            "Error:",
            error.response ? error.response.data : error.message
        );
    }
}

test();
