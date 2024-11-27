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

    static getSession(userId) {
        return fetch(
            `http://localhost:8000/get-session?user_id=${userId}`, 
            {
                method: "GET",
                mode: "cors"
            }
        )
    }

    static deleteSession(sessionId) {
        return fetch(
            `http://localhost:8000/delete-session`, 
            {
                method: "POST",
                mode: "cors",
                headers: { 
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    session_id: sessionId
                })
            }
        )
    }
}

export default SessionAPI