const scriptURL = 'https://script.google.com/macros/s/AKfycbx55eV8ZF3unIqn1lr1quKT60RsNyvrXo7AO2a_mthE4rPXMaIkdAe3xGUUkHUHH6U/exec';

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('Username').value;
    const pass = document.getElementById('Password').value;

    // Check credentials: Username is required, password must be "123"
    if (pass === '123' && user.trim() !== '') {
        // Success
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminTableSection').style.display = 'block';
        fetchTableData();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminTableSection').style.display = 'none';
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').style.display = 'none';
});

const tableBody = document.getElementById('tableBody');

function fetchTableData() {
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #94a3b8; padding: 30px;">Loading data securely...</td></tr>';
    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            renderTable(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #f87171; padding: 30px;">Error loading data from Google Sheets</td></tr>';
        });
}

function renderTable(dataArray) {
    if (!dataArray || dataArray.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #94a3b8; padding: 30px;">No visitor records found</td></tr>';
        return;
    }

    let html = '';
    const visitors = Array.isArray(dataArray) ? dataArray : (dataArray.data || []);
    const recentVisitors = [...visitors].reverse();

    recentVisitors.forEach(visitor => {
        const status = visitor.Status || visitor.status || 'In';
        const statusClass = status.toLowerCase() === 'in' ? 'status-in' : 'status-out';

        html += `
            <tr>
                <td>${visitor.VisitorName || '-'}</td>
                <td>${visitor.Mobile || '-'}</td>
                <td>${visitor.VehicleNo || '-'}</td>
                <td>${visitor.Purpose || '-'}</td>
                <td>${visitor.ResidentName || '-'}</td>
                <td>${visitor.FlatNo || '-'}</td>
                <td>${visitor.EntryTime || '-'}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}
