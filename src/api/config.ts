import 'dotenv/config';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro tentando obter token ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

(async () => {
  try {
    const token = await getSpotifyToken();
    console.log(`token: ${token}`)
  } catch (err) {
    console.error(err);
  }
})();
