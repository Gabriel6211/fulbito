interface DbConnectionResponse {
  status: string;
  message: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Checks the connection status of the external database API.
 * @returns A promise that resolves to the connection status object.
 */
export async function testDbConnection(): Promise<DbConnectionResponse> {
  const url = `${BASE_URL}/api/health`;

  try {
    // 2. Use the native Fetch API to make the GET request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // Optional: include any necessary headers, like Authorization or Content-Type
        "Content-Type": "application/json",
      },
      // Optional: cache control settings
      cache: "no-store", // This is often good for ensuring fresh data
    });

    // 3. Handle HTTP errors (e.g., 404, 500)
    if (!response.ok) {
      // Throw an error with the status code for the calling component to catch
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 4. Parse the JSON body and cast it to your defined TypeScript type
    const data: DbConnectionResponse = await response.json();

    return data;
  } catch (error) {
    // 5. Handle network errors or the error thrown above
    console.error("Error testing DB connection:", error);
    // Re-throw or return a structured error response
    throw new Error("Failed to connect to the external API.");
  }
}
