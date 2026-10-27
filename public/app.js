let userId;

const $ = id => document.getElementById(id);

async function registerUser(e) {
    e.preventDefault();

    const data = {
        username: $("username").value,
        email: $("reg-email").value,
        rollNumber: $("roll-number").value,
        casualLeave: +$("casual-leave").value,
        medicalLeave: +$("medical-leave").value
    };

    const res = await fetch("/api/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const result = await res.json();
    $("registration-response").innerText = result.message;

    if (res.ok) {
        $("registration-form").reset();
        $("registration-section").style.display = "none";
        $("login-section").style.display = "block";
    }
}

async function loginUser(e) {
    e.preventDefault();

    const res = await fetch("/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: $("email").value })
    });

    const data = await res.json();

    if (!res.ok) {
        $("response-message").innerText = data.message;
        return;
    }

    userId = data.userId;

    $("username-display").innerText = data.username;
    $("roll-number-display").innerText = data.rollNumber;
    $("casual-leave-display").innerText = data.casualLeave;
    $("medical-leave-display").innerText = data.medicalLeave;

    $("login-section").style.display = "none";
    $("balance-section").style.display = "block";
    $("apply-leave-section").style.display = "block";
    $("logout-button").style.display = "inline";
}

async function refreshBalance() {
    const res = await fetch(`/api/leave-balance/${userId}`);
    const data = await res.json();

    $("casual-leave-display").innerText = data.casualLeave;
    $("medical-leave-display").innerText = data.medicalLeave;
}

async function applyLeave(e) {
    e.preventDefault();

    const data = {
        type: $("leave-type").value,
        days: $("leave-days").value
    };

    const res = await fetch(`/api/apply-leave/${userId}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
        $("casual-leave-display").innerText = result.casualLeave;
        $("medical-leave-display").innerText = result.medicalLeave;
        $("response-message").innerText = result.message;
        $("leave-form").reset();
    } else {
        $("response-message").innerText = result.message;
    }
}

function logoutUser() {
    $("balance-section").style.display = "none";
    $("apply-leave-section").style.display = "none";
    $("login-section").style.display = "block";
    $("response-message").innerText = "";
}

$("registration-form").onsubmit = registerUser;
$("login-form").onsubmit = loginUser;
$("leave-form").onsubmit = applyLeave;
$("refresh-balance").onclick = refreshBalance;
$("logout-button").onclick = logoutUser;

$("show-registration").onclick = () => {
    $("registration-section").style.display = "block";
    $("login-section").style.display = "none";
};

$("show-login").onclick = () => {
    $("registration-section").style.display = "none";
    $("login-section").style.display = "block";
};