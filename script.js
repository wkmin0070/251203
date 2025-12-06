// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Basic navigation functionality
    const navLinks = document.querySelectorAll('nav ul li a');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            contentSections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });

    // Show dashboard by default
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('equipment-list').style.display = 'none';
    document.getElementById('admin').style.display = 'none';

    let equipmentData = [
        { type: 'AIR COMPRESSOR', name: 'AIR COMPRESSOR #1', status: 'ACTIVE', remarks: 'Daily check complete', location: 'PKG 4', pierNo: 'P001' },
        { type: 'BOOM TRUCK', name: 'BOOM TRUCK #1', status: 'BREAKDOWN', remarks: 'Hydraulic system repair', location: 'PKG 5', pierNo: 'P002' },
        { type: 'CONCRETE PUMP CAR', name: 'CONCRETE PUMP CAR #1', status: 'IDLE', remarks: 'Awaiting deployment', location: 'PKG 6', pierNo: 'P003' },
        { type: 'FORKLIFT', name: 'FORKLIFT #1', status: 'ACTIVE', remarks: 'Transporting materials', location: 'PKG 4', pierNo: 'P004' },
        { type: 'GENSET', name: 'GENSET #1', status: 'ACTIVE', remarks: 'Powering site office', location: 'PKG 5', pierNo: 'P005' },
        { type: 'HYDRO CRANE', name: 'HYDRO CRANE #1', status: 'ACTIVE', remarks: 'Lifting beams', location: 'PKG 6', pierNo: 'P006' },
        { type: 'MANLIFT', name: 'MANLIFT #1', status: 'IDLE', remarks: 'Available for high-reach tasks', location: 'PKG 4', pierNo: 'P007' },
        { type: 'TRAILER (FLATBED)', name: 'TRAILER #1', status: 'ACTIVE', remarks: 'Transporting large components', location: 'PKG 5', pierNo: 'P008' },
        { type: 'TOWER LIGHT', name: 'TOWER LIGHT #1', status: 'ACTIVE', remarks: 'Night work illumination', location: 'PKG 6', pierNo: 'P009' },
        { type: 'EXCAVATOR', name: 'Excavator #1', status: 'ACTIVE', remarks: 'Digging trench', location: 'PKG 4', pierNo: 'P010' },
        { type: 'EXCAVATOR', name: 'Excavator #2', status: 'BREAKDOWN', remarks: 'Engine overhaul', location: 'PKG 5', pierNo: 'P011' }
    ];

    const operatorData = [
        { name: 'John Doe', status: 'Available', assignedEquipment: 'Excavator #1' },
        { name: 'Jane Smith', status: 'On Duty', assignedEquipment: 'Crane #1' },
        { name: 'Peter Jones', status: 'Off Duty', assignedEquipment: 'N/A' }
    ];

    const packageData = [
        { name: 'PKG 4', status: 'In Progress', progress: '60%', equipmentCount: 2, operatorCount: 2 },
        { name: 'PKG 5', status: 'Pending', progress: '0%', equipmentCount: 0, operatorCount: 0 },
        { name: 'PKG 6', status: 'Completed', progress: '100%', equipmentCount: 3, operatorCount: 3 }
    ];

    let equipmentChart, operatorChart, packageChart; // Declare chart variables globally

    function populateRemoveEquipmentSelect() {
        const selectElement = document.getElementById('remove-eq-select');
        selectElement.innerHTML = '<option value="">--Select Equipment--</option>'; // Clear and add default option

        equipmentData.forEach(eq => {
            const option = document.createElement('option');
            option.value = eq.name;
            option.textContent = eq.name;
            selectElement.appendChild(option);
        });
    }

    function populateEquipmentTypeFilter() {
        const filterSelect = document.getElementById('equipment-type-filter');
        filterSelect.innerHTML = '<option value="all">All Types</option>';

        const uniqueTypes = [...new Set(equipmentData.map(eq => eq.type))];
        uniqueTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            filterSelect.appendChild(option);
        });
    }

    function renderDashboard() {
        // Equipment Status Overview
        const operatingEquipment = equipmentData.filter(eq => eq.status === 'ACTIVE').length;
        const maintenanceEquipment = equipmentData.filter(eq => eq.status === 'BREAKDOWN').length;
        const idleEquipment = equipmentData.filter(eq => eq.status === 'IDLE').length;

        document.getElementById('total-equipment').textContent = equipmentData.length;
        document.getElementById('operating-equipment').textContent = operatingEquipment;
        document.getElementById('maintenance-equipment').textContent = maintenanceEquipment;
        document.getElementById('idle-equipment').textContent = idleEquipment;

        // Operator Status Overview
        const availableOperators = operatorData.filter(op => op.status === 'Available').length;
        const onDutyOperators = operatorData.filter(op => op.status === 'On Duty').length;
        const offDutyOperators = operatorData.filter(op => op.status === 'Off Duty').length;

        document.getElementById('total-operators').textContent = operatorData.length;
        document.getElementById('available-operators').textContent = availableOperators;
        document.getElementById('on-duty-operators').textContent = onDutyOperators;
        document.getElementById('off-duty-operators').textContent = offDutyOperators;

        // Package-wise Status Overview (Table)
        const packageStatusTableBody = document.getElementById('package-status-table-body');
        packageStatusTableBody.innerHTML = ''; // Clear previous content

        packageData.forEach(pkg => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pkg.name}</td>
                <td><span class="status ${pkg.status.toLowerCase().replace(/ /g, '-')}">${pkg.status}</span></td>
                <td>${pkg.progress}</td>
                <td>${pkg.equipmentCount}</td>
                <td>${pkg.operatorCount}</td>
            `;
            packageStatusTableBody.appendChild(row);
        });

        // Render Charts
        renderEquipmentStatusChart(operatingEquipment, maintenanceEquipment, idleEquipment);
        renderOperatorStatusChart(availableOperators, onDutyOperators, offDutyOperators);
        // renderPackageStatusChart(packageData); // Removed as requested to display as table
    }

    function renderEquipmentStatusChart(operating, maintenance, idle) {
        const ctx = document.getElementById('equipmentStatusChart').getContext('2d');
        if (equipmentChart) {
            equipmentChart.destroy(); // Destroy existing chart before re-rendering
        }
        equipmentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Operating', 'Maintenance', 'Idle'],
                datasets: [{
                    data: [operating, maintenance, idle],
                    backgroundColor: [
                        '#27ae60',
                        '#e67e22',
                        '#8e44ad'
                    ],
                    borderColor: [
                        '#ffffff',
                        '#ffffff',
                        '#ffffff'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Equipment Status'
                    }
                }
            },
        });
    }

    function renderOperatorStatusChart(available, onDuty, offDuty) {
        const ctx = document.getElementById('operatorStatusChart').getContext('2d');
        if (operatorChart) {
            operatorChart.destroy(); // Destroy existing chart before re-rendering
        }
        operatorChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Available', 'On Duty', 'Off Duty'],
                datasets: [{
                    label: 'Number of Operators',
                    data: [available, onDuty, offDuty],
                    backgroundColor: [
                        '#27ae60',
                        '#e67e22',
                        '#8e44ad'
                    ],
                    borderColor: [
                        '#ffffff',
                        '#ffffff',
                        '#ffffff'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Operator Status'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
        });
    }

    function renderEquipmentList(filterType = 'all') {
        const equipmentListBody = document.getElementById('equipment-list-body');
        equipmentListBody.innerHTML = ''; // Clear existing rows

        const filteredEquipment = equipmentData.filter(eq => {
            return filterType === 'all' || eq.type === filterType;
        });

        filteredEquipment.forEach(eq => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${eq.type}</td>
                <td>${eq.name}</td>
                <td>${eq.status}</td>
                <td>${eq.remarks}</td>
                <td>${eq.location}</td>
                <td>${eq.pierNo || 'N/A'}</td>
            `;
            equipmentListBody.appendChild(row);
        });
    }

    const addEquipmentForm = document.getElementById('add-equipment-form');
    addEquipmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const eqType = document.getElementById('add-eq-type-select').value;
        const eqName = document.getElementById('eq-name').value;
        const eqStatus = document.getElementById('eq-status').value; // Get status from new dropdown
        const eqRemarks = document.getElementById('eq-remarks').value;
        const eqLocation = document.getElementById('eq-location-select').value; // Get location from new dropdown
        const eqPierNo = document.getElementById('eq-pier-no').value; // Get Pier No. from new input

        equipmentData.push({ type: eqType, name: eqName, status: eqStatus, remarks: eqRemarks, location: eqLocation, pierNo: eqPierNo }); // Add pierNo to data

        renderDashboard();
        renderEquipmentList();
        populateRemoveEquipmentSelect(); // Update select dropdown
        populateEquipmentTypeFilter(); // Update filter dropdown

        addEquipmentForm.reset(); // Clear form fields
    });

    const removeEquipmentForm = document.getElementById('remove-equipment-form');
    removeEquipmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const removeEqName = document.getElementById('remove-eq-select').value;
        if (!removeEqName) {
            alert('Please select an equipment to remove.');
            return;
        }

        const initialLength = equipmentData.length;
        equipmentData = equipmentData.filter(eq => eq.name !== removeEqName);

        if (equipmentData.length < initialLength) {
            alert(`${removeEqName} removed successfully.`);
        } else {
            // This case should ideally not happen if the dropdown is populated correctly,
            // but it's good for robustness.
            alert(`${removeEqName} not found.`);
        }

        renderDashboard();
        renderEquipmentList();
        populateRemoveEquipmentSelect(); // Update select dropdown
        populateEquipmentTypeFilter(); // Update filter dropdown

        removeEquipmentForm.reset(); // Clear form fields
    });

    // Event listener for equipment type filter
    const equipmentTypeFilter = document.getElementById('equipment-type-filter');
    equipmentTypeFilter.addEventListener('change', (e) => {
        renderEquipmentList(e.target.value);
    });

    // Initial render of dashboard data
    renderDashboard();

    // Initial render of equipment list
    renderEquipmentList(); // Call the single list render function

    // Populate remove equipment select dropdown
    populateRemoveEquipmentSelect();

    // Populate equipment type filter dropdown
    populateEquipmentTypeFilter();

    // Firebase 구성 (본인의 프로젝트 설정으로 교체하세요!)
    const firebaseConfig = {
        apiKey: "AIzaSyCMQgkMmDH2JN4QltFZS-LctTr4uIg5NJA",
        authDomain: "test-8556c.firebaseapp.com",
        projectId: "test-8556c",
        storageBucket: "test-8556c.firebasestorage.app",
        messagingSenderId: "782289495506",
        appId: "1:782289495506:web:fdd6599e7d694ff4e4140b",
        measurementId: "G-4ECE66M7XT"
    };

    // Firebase 초기화
    firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();
    const db = firebase.firestore();

    // DOM 요소 참조
    const userStatusElement = document.getElementById('user-status');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const todoFormSection = document.getElementById('todo-form-section'); // 이제 항상 표시됩니다.
    const newTodoInput = document.getElementById('new-todo-input');
    const addTodoButton = document.getElementById('add-todo-button');
    const todoList = document.getElementById('todo-list');

    let unsubscribeFromTodos = null; // 실시간 업데이트 구독을 위한 변수

    // --- 인증 관련 함수 ---
    // Google 로그인
    loginButton.addEventListener('click', async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await auth.signInWithPopup(provider);
        } catch (error) {
            console.error("Google 로그인 오류:", error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    });

    // 로그아웃
    logoutButton.addEventListener('click', async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("로그아웃 오류:", error);
            alert("로그아웃 중 오류가 발생했습니다.");
        }
    });

    // 인증 상태 변화 감지
    auth.onAuthStateChanged(user => {
        if (user) {
            // 사용자 로그인됨
            userStatusElement.textContent = `환영합니다, ${user.displayName || user.email}!`;
            loginButton.style.display = 'none';
            logoutButton.style.display = 'inline-block';
            // todoFormSection은 HTML에서 display: none;이 제거되어 항상 표시됩니다.
            loadUserTodos(user.uid); // 로그인하면 할 일 목록 로드
        } else {
            // 사용자 로그아웃됨
            userStatusElement.textContent = '로그인하지 않음';
            loginButton.style.display = 'inline-block';
            logoutButton.style.display = 'none';
            // todoFormSection은 HTML에서 display: none;이 제거되어 항상 표시됩니다.
            todoList.innerHTML = ''; // 할 일 목록 비우기 (비로그인 사용자는 자신의 목록이 없으므로)
            if (unsubscribeFromTodos) {
                unsubscribeFromTodos(); // 구독 해제
                unsubscribeFromTodos = null;
            }
        }
    });

    // --- Firestore 할 일 관리 함수 ---

    // 할 일 추가
    addTodoButton.addEventListener('click', async () => {
        const todoText = newTodoInput.value.trim();
        const user = auth.currentUser; // 현재 사용자 정보 (로그인되어 있지 않으면 null)

        if (todoText) {
            try {
                await db.collection('todos').add({
                    text: todoText,
                    completed: false,
                    userId: user ? user.uid : null, // 로그인되어 있으면 UID, 아니면 null (누구나 추가 가능)
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                newTodoInput.value = ''; // 입력 필드 초기화
            } catch (error) {
                console.error("할 일 추가 오류:", error);
                alert("할 일 추가에 실패했습니다. 규칙을 확인하세요.");
            }
        } else {
            alert("할 일 내용을 입력해주세요.");
        }
    });

    // 사용자의 할 일 목록을 실시간으로 로드 (로그인된 사용자만 해당)
    function loadUserTodos(uid) {
        if (unsubscribeFromTodos) {
            unsubscribeFromTodos(); // 이전 구독 해제
        }

        // 현재 사용자의 할 일만 필터링하여 실시간 업데이트를 구독
        unsubscribeFromTodos = db.collection('todos')
            .where('userId', '==', uid) // 중요: 현재 사용자의 할 일만 가져옴
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                todoList.innerHTML = ''; // 기존 목록 초기화
                snapshot.forEach(doc => {
                    const todo = doc.data();
                    const li = document.createElement('li');
                    li.dataset.id = doc.id;
                    li.className = todo.completed ? 'completed' : '';

                    li.innerHTML = `
                        <span>${todo.text}</span>
                        <div class="actions">
                            <button class="complete-button">${todo.completed ? '미완료' : '완료'}</button>
                            <button class="delete-button">삭제</button>
                        </div>
                    `;
                    todoList.appendChild(li);
                });
            }, error => {
                console.error("할 일 목록 로드 오류:", error);
                alert("할 일 목록을 불러오는 데 실패했습니다. 규칙을 확인하세요.");
            });
    }

    // 할 일 완료/미완료 토글 및 삭제
    todoList.addEventListener('click', async (event) => {
        const li = event.target.closest('li');
        if (!li) return;

        const todoId = li.dataset.id;
        const user = auth.currentUser;

        if (!user) {
            alert("이 작업을 수행하려면 로그인해야 합니다.");
            return;
        }

        if (event.target.classList.contains('complete-button')) {
            // 할 일 완료 상태 토글
            const currentCompleted = li.classList.contains('completed');
            try {
                await db.collection('todos').doc(todoId).update({
                    completed: !currentCompleted
                });
            } catch (error) {
                console.error("할 일 상태 업데이트 오류:", error);
                alert("할 일 상태 업데이트에 실패했습니다. 규칙을 확인하세요.");
            }
        } else if (event.target.classList.contains('delete-button')) {
            // 할 일 삭제
            if (confirm("정말로 이 할 일을 삭제하시겠습니까?")) {
                try {
                    await db.collection('todos').doc(todoId).delete();
                } catch (error) {
                    console.error("할 일 삭제 오류:", error);
                    alert("할 일 삭제에 실패했습니다. 규칙을 확인하세요.");
                }
            }
        }
    });
});
