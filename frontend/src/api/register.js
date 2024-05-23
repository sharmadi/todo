export const addUser = ( {draftUser} ) => {
    let finalUser = draftUser;
    finalUser.userId = Math.random().toString(16).slice(2);
    console.log(finalUser);
    if(finalUser.email != '' && finalUser.password != ''){
        fetch(`${import.meta.env.VITE_TODO_API_URL}/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({objectUser: finalUser})
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response: ", data);
        })
        .catch(error => {
        console.error('Error:', error);
        });
    }
}