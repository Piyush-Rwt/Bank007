let accounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];

function showSection(sectionId) {
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    clearMessages();
}

function clearMessages() {
    document.querySelectorAll('.status-card').forEach(msg => {
        msg.style.display = 'none';
    });
}

function createAccount() {
    const accountNumber = `NEO-${Date.now().toString().slice(-6)}`;
    const name = document.getElementById('fullName').value;
    const balance = parseFloat(document.getElementById('initialDeposit').value);
    const successMessage = document.getElementById('accountCreated');

    if (balance < 50) {
        alert('Minimum initial deposit is $50');
        return;
    }

    accounts.push({
        accountNumber,
        name,
        balance,
        transactions: [{
            type: 'initial deposit',
            amount: balance,
            date: new Date().toISOString()
        }]
    });

    localStorage.setItem('bankAccounts', JSON.stringify(accounts));
    
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Account Created Successfully!</h3>
        <div class="account-details">
            <p><strong>Account Number:</strong> ${accountNumber}</p>
            <p><strong>Account Holder:</strong> ${name}</p>
            <p><strong>Initial Balance:</strong> $${balance.toFixed(2)}</p>
        </div>
    `;
    successMessage.style.display = 'block';
    document.getElementById('createForm').reset();
}

function handleTransaction(type) {
    const accNumber = document.getElementById('accountNumber').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const resultDiv = document.getElementById('transactionResult');
    const account = accounts.find(acc => acc.accountNumber === accNumber);

    resultDiv.className = 'status-card'; // Reset classes

    if (!account) {
        resultDiv.classList.add('error');
        resultDiv.innerHTML = `
            <i class="fas fa-times-circle"></i>
            <h3>Account Not Found!</h3>
            <p>Please check the account number</p>
        `;
        resultDiv.style.display = 'block';
        return;
    }

    if (type === 'deposit') {
        account.balance += amount;
        account.transactions.push({
            type: 'deposit',
            amount,
            date: new Date().toISOString()
        });
        resultDiv.classList.add('success');
        resultDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Deposit Successful!</h3>
            <p>Amount: $${amount.toFixed(2)}</p>
            <p>New Balance: $${account.balance.toFixed(2)}</p>
        `;
    } else if (type === 'withdraw') {
        if (account.balance >= amount) {
            account.balance -= amount;
            account.transactions.push({
                type: 'withdrawal',
                amount,
                date: new Date().toISOString()
            });
            resultDiv.classList.add('success');
            resultDiv.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Withdrawal Successful!</h3>
                <p>Amount: $${amount.toFixed(2)}</p>
                <p>Remaining Balance: $${account.balance.toFixed(2)}</p>
            `;
        } else {
            resultDiv.classList.add('error');
            resultDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Insufficient Funds!</h3>
                <p>Available Balance: $${account.balance.toFixed(2)}</p>
            `;
        }
    }

    resultDiv.style.display = 'block';
    localStorage.setItem('bankAccounts', JSON.stringify(accounts));
    document.getElementById('transactionForm').reset();
}

function viewAccountDetails() {
    const accNumber = document.getElementById('viewAccountNumber').value;
    const detailsDiv = document.getElementById('accountDetails');
    const account = accounts.find(acc => acc.accountNumber === accNumber);

    detailsDiv.innerHTML = ''; // Clear previous content

    if (account) {
        detailsDiv.innerHTML = `
            <div class="account-header">
                <i class="fas fa-user-circle"></i>
                <h3>${account.name}'s Account</h3>
            </div>
            <div class="account-info">
                <p><i class="fas fa-id-card"></i> <strong>Account Number:</strong> ${account.accountNumber}</p>
                <p><i class="fas fa-wallet"></i> <strong>Balance:</strong> $${account.balance.toFixed(2)}</p>
            </div>
            <div class="transaction-history">
                <h4><i class="fas fa-history"></i> Recent Transactions</h4>
                ${account.transactions.slice(-5).reverse().map(transaction => `
                    <div class="transaction-item ${transaction.type}">
                        <div class="transaction-icon">
                            ${transaction.type === 'deposit' ? 
                              '<i class="fas fa-arrow-down success"></i>' : 
                              '<i class="fas fa-arrow-up danger"></i>'}
                        </div>
                        <div class="transaction-details">
                            <p class="transaction-type">${transaction.type.toUpperCase()}</p>
                            <p class="transaction-amount">$${transaction.amount.toFixed(2)}</p>
                            <p class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        detailsDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Account Not Found</h3>
                <p>Please check the account number and try again</p>
            </div>
        `;
    }
    document.getElementById('viewForm').reset();
}

// Initialize default view
showSection('create');