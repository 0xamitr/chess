
export default function uploadGame(body) {
    console.log(body)
    fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify(body)
    })
    .then(data => {
        // Handle the response from the API
        console.log(data);
    })
    .catch(error => {
        // Handle any errors that occur during the request
        console.error(error);
    });
}