import axios from "axios";
import fs from "fs";

const clientId = "";
const clientSecret = "";
const projectKey = "";

async function authenticate() {
    const res = await axios.post(
        "https://xray.cloud.getxray.app/api/v2/authenticate",
        { client_id: clientId, client_secret: clientSecret }
    );
    return res.data;
}

async function uploadResults(jwt) {
    const results = fs.readFileSync("results.xml", "utf8");

    const res = await axios.post(
        "https://xray.cloud.getxray.app/api/v2/import/execution/junit",
        results,
        {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/xml"
            },
            params: {
                projectKey
            }
        }
    );
    console.log("Exported: ", res.data);
}

(async () => {
    try {
        const jwt = await authenticate();
        await uploadResults(jwt);
    } catch (err) {
        console.error("Error: ", err.response?.data || err.message);
    }
})();
