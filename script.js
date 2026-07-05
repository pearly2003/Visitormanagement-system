// const scriptURL = 'https://script.google.com/macros/s/AKfycbwv1e1uWP2cSMBFdyX7fmh_OLaa8uNeoIaD_KFLgQuP8ZmyDVV4Q6iIh_GJT0EXxJaNZg/exec';
const scriptURL = 'https://script.google.com/macros/s/AKfycbx55eV8ZF3unIqn1lr1quKT60RsNyvrXo7AO2a_mthE4rPXMaIkdAe3xGUUkHUHH6U/exec';
const form = document.forms['google-sheet'];
const submitBtn = document.getElementById('submitBtn');

// Set current date and time as default for EntryTime
function setDefaultTime() {
    const now = new Date();
    // Format: YYYY-MM-DDThh:mm
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    const entryTimeInput = document.getElementById('EntryTime');

    entryTimeInput.value = dateTimeString;
    // Set the minimum allowed date to today at 00:00 to prevent past dates
    entryTimeInput.min = `${year}-${month}-${day}T00:00`;
}

// Initialize page
setDefaultTime();

// Form Submission using JSON.stringify
form.addEventListener('submit', e => {
    e.preventDefault();

    // Determine Purpose
    const purposeSelect = document.getElementById('PurposeSelect').value;
    const finalPurpose = purposeSelect === 'Other' ? document.getElementById('PurposeText').value : purposeSelect;

    if (purposeSelect === 'Other' && !finalPurpose.trim()) {
        alert("Please specify the 'Other' purpose.");
        return;
    }

    // Format datetime string to look nice in Google Sheets (replace 'T' with a space)
    let entryDateTime = document.getElementById('EntryTime').value.replace('T', ' ');

    // Build the JSON object precisely as requested
    const visitorData = {
        VisitorID: 'VID' + Date.now().toString().slice(-6),
        VisitorName: document.getElementById('VisitorName').value,
        Mobile: document.getElementById('Mobile').value,
        VehicleNo: document.getElementById('VehicleNo').value,
        Purpose: finalPurpose,
        FlatNo: document.getElementById('FlatNo').value,
        ResidentName: document.getElementById('ResidentName').value,
        EntryTime: entryDateTime,
        ExitTime: "",
        Status: "In"
    };

    // UI Loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Saving...';
    submitBtn.disabled = true;

    // Send POST request with JSON body
    fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(visitorData)
    })
        .then(res => res.json())
        .then(data => {
            console.log("Success:", data);

            // Success UI state
            submitBtn.innerHTML = '✔ Saved Successfully!';
            submitBtn.style.background = '#10b981';

            form.reset();
            setDefaultTime(); // Reset time to current time
            document.getElementById('OtherPurposeGroup').style.display = 'none'; // Hide Other text box

            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        })
        .catch(error => {
            console.error('Error:', error);
            submitBtn.innerHTML = '✖ Error Saving';
            submitBtn.style.background = '#ef4444';

            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
});
