class SessionAPI {
    static createSession(userId) {
        return fetch(
            `http://localhost:8000/create-session`, 
            {
                method: "POST",
                mode: "cors",
                headers: { 
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    user_id: userId
                })
            }
        )
    }
}

export default SessionAPI