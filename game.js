const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let myArmy = [];
let enemyArmy = [];
let spawnTimer = 0;

// Hàm tạo lính (Phe mình)
function spawnUnit(type) {
    if (type === 'warrior') {
        myArmy.push({ x: 30, hp: 100, maxHp: 100, speed: 1, damage: 0.5, color: "#3498db", size: 15 });
    } else if (type === 'archer') {
        myArmy.push({ x: 30, hp: 60, maxHp: 60, speed: 0.8, damage: 0.3, color: "#2ecc71", size: 12 });
    }
}

// Hàm tự động tạo lính (Phe địch)
function spawnEnemy() {
    enemyArmy.push({ x: 370, hp: 90, maxHp: 90, speed: -1, damage: 0.4, color: "#e74c3c", size: 15 });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Vẽ mặt đất
    ctx.fillStyle = "#1e272e";
    ctx.fillRect(0, 160, canvas.width, 40);

    // 2. Vẽ Thành lũy 2 bên
    ctx.fillStyle = "#7f8c8d"; ctx.fillRect(0, 60, 30, 100); // Thành ta
    ctx.fillStyle = "#c0392b"; ctx.fillRect(370, 60, 30, 100); // Thành địch

    // Tự động sinh lính địch sau mỗi 2.5 giây (150 khung hình)
    spawnTimer++;
    if (spawnTimer % 150 === 0) spawnEnemy();

    // 3. Cập nhật & Vẽ lính mình
    myArmy.forEach((unit) => {
        let hasEnemyAhead = enemyArmy.some(enemy => Math.abs(enemy.x - unit.x) < 20);
        
        if (!hasEnemyAhead && unit.x < 350) {
            unit.x += unit.speed; // Đi tiếp nếu đường trống
        } else if (hasEnemyAhead) {
            // Tấn công lính địch ở gần nhất
            enemyArmy.forEach(enemy => {
                if (Math.abs(enemy.x - unit.x) < 20) enemy.hp -= unit.damage;
            });
        }
        
        // Vẽ thanh máu nhỏ trên đầu lính
        ctx.fillStyle = "red"; ctx.fillRect(unit.x - 5, 110, 25, 4);
        ctx.fillStyle = "green"; ctx.fillRect(unit.x - 5, 110, (unit.hp / unit.maxHp) * 25, 4);

        // Vẽ hình nhân vật (Sau này bạn thay bằng ảnh)
        ctx.fillStyle = unit.color;
        ctx.fillRect(unit.x, 120, unit.size, 40);
    });

    // 4. Cập nhật & Vẽ lính địch
    enemyArmy.forEach((enemy) => {
        let hasPlayerAhead = myArmy.some(unit => Math.abs(enemy.x - unit.x) < 20);
        
        if (!hasPlayerAhead && enemy.x > 40) {
            enemy.x += enemy.speed;
        } else if (hasPlayerAhead) {
            // Tấn công lính ta
            myArmy.forEach(unit => {
                if (Math.abs(enemy.x - unit.x) < 20) unit.hp -= enemy.damage;
            });
        }

        // Vẽ thanh máu địch
        ctx.fillStyle = "red"; ctx.fillRect(enemy.x - 5, 110, 25, 4);
        ctx.fillStyle = "green"; ctx.fillRect(enemy.x - 5, 110, (enemy.hp / enemy.maxHp) * 25, 4);

        // Vẽ hình nhân vật địch
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, 120, enemy.size, 40);
    });

    // 5. Loại bỏ lính tử trận
    myArmy = myArmy.filter(u => u.hp > 0);
    enemyArmy = enemyArmy.filter(e => e.hp > 0);

    requestAnimationFrame(gameLoop);
}

// Bắt đầu chạy game
gameLoop();
