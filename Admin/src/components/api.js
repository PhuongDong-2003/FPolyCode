export const fetchUserDataById = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        throw new Error(`Error fetching user data: ${error.message}`);
    }
};