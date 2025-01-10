export async function fetchVisitCount(pageUrl, visitorId) {
  const apiUrl = 'https://ogredencom-functions-staging.azurewebsites.net/api/CountVisits';

  // Perform the actual POST request
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PageUrl: pageUrl,
        VisitorId: visitorId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Assuming the API response contains visit count
  } catch (error) {
    console.error('Error fetching visit count:', error);
  }
}