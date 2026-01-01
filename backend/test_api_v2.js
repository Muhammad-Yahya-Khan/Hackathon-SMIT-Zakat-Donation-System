async function test() {
    try {
        // Login
        console.log("Logging in...");
        const loginRes = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "admin@zakat.com",
                password: "admin123",
            }),
        });

        if (!loginRes.ok) {
            const err = await loginRes.text();
            throw new Error(`Login failed: ${loginRes.status} ${err}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Token received");

        // Get Users
        console.log("Fetching users...");
        const usersRes = await fetch("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!usersRes.ok) {
            const err = await usersRes.text();
            throw new Error(`Fetch users failed: ${usersRes.status} ${err}`);
        }

        const usersData = await usersRes.json();
        console.log("Users fetched:", usersData.length);
        console.log(
            "Data type:",
            Array.isArray(usersData) ? "Array" : typeof usersData
        );
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
