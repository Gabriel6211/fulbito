interface UserData {
  fullName: string;
  photo: string | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const url = `${BASE_URL}/users/`;

export async function createUser(userData: UserData, token: string) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error testing DB connection:", error);
    throw new Error("Failed to connect to the external API.");
  }
}

export async function getUserById(userId: string) {
  try {
    const endpoint = url + userId;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting User information:", error);
    throw new Error("Failed to get user information");
  }
}
