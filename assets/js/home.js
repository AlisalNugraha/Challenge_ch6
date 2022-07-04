function getLoginFormData() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    return { username, password};
}

async function onSubmit() {
    const formData = getLoginFormData();
    const response = await fetch('http://localhost:4040/login', {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(formData)
    });
    console.log(await response.json());
}