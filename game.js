if (!Detector.webgl) Detector.addGetWebGLMessage();

var computer = new Computer();

var container;
var camera, scene, renderer;
var plane1, plane2, cube;
var mouse, raycaster, rotateRight = false,
    rotateLeft = false;
plaecdBoat = false;
var plaecdBoatNum = 0;

var rollOverMesh, rollOverMaterial;
var accGeo, btsGeo, fgGeo, sbmGeo, msprGeo, cubeMaterial;
var markCube, markCubeMaterial1, markCubeMaterial2;

var plane1Objects = [];
var plane2Objects = [];
var boardObjects = [];
var boatObjects = [];
var wallObjects = [];
var planeObjects = [];

var currentBoat, currentBoatDepth;
var grids = [];
var playerGrids = [];
var computerGrids = [];
var pointsMin = [];
var maxCounts;
var playCounts = 0;
var currentGridX, currentGridY;
var rotateCount = 0;
var attackStatus = false;
var hitCount = 0,
    missCount = 0;

for (let i = 0; i < 8; i++) {
    grids[i] = [];
    playerGrids[i] = [];
}
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        grids[i][j] = 0;
        playerGrids[i][j] = 0;
    }
}

init();
render();

function init() {
    //容器
    container = document.createElement('div');
    document.body.appendChild(container);

    //游戏标题
    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = "<strong>Naval Battle!</strong><br><strong>Click</strong> to add a ship,<br>Use <strong><-</strong> or <strong>-></strong> to change its direction.<br><strong>Green</strong> represents effective hitting.";
    container.appendChild(info);

    //相机
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(200, 1000, 800);
    camera.lookAt(new THREE.Vector3());

    //场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    //灯光
    var ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    //射线
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    //坐标系
    var axes = new THREE.AxesHelper(1000);
    scene.add(axes);

    //网格
    var gridHelper1 = new THREE.GridHelper(400, 8);
    var gridHelper2 = new THREE.GridHelper(400, 8);
    gridHelper1.position.set(-300, 12.5, 0);
    gridHelper2.position.set(300, 12.5, 0);
    scene.add(gridHelper1, gridHelper2);

    //甲板平面
    var geometry = new THREE.BoxGeometry(400, 400, 5);
    var boardGeo = new THREE.BoxGeometry(2000, 1200, 50);
    geometry.rotateX(-Math.PI / 2);
    boardGeo.rotateX(-Math.PI / 2);

    plane1 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
        color: 0x81d4fa,
        opacity: 0.5,
        transparent: true
    }));
    plane2 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
        color: 0x81d4fa,
        opacity: 0.5,
        transparent: true
    }));
    board = new THREE.Mesh(boardGeo, new THREE.MeshPhongMaterial({
        color: 0xbdbdbd
    }));
    plane1.position.set(-300, 12.5, 0);
    plane2.position.set(300, 12.5, 0);
    board.position.set(0, -200, -50);
    plane1.castShadow = true;
    plane2.castShadow = true;
    board.receiveShadow = true;

    scene.add(plane1, plane2, board);
    plane1Objects.push(plane1);
    plane2Objects.push(plane2);
    planeObjects.push(plane1, plane2)
    boardObjects.push(board);

    var wallGeo = new THREE.BoxGeometry(50, 400, 50);
    wallGeo.rotateX(-Math.PI / 2);
    wall1 = new THREE.Mesh(wallGeo, new THREE.MeshBasicMaterial({
        visible: false
    }))
    wall2 = new THREE.Mesh(wallGeo, new THREE.MeshBasicMaterial({
        visible: false
    }))
    wall3 = new THREE.Mesh(wallGeo, new THREE.MeshBasicMaterial({
        visible: false
    }))
    wall4 = new THREE.Mesh(wallGeo, new THREE.MeshBasicMaterial({
        visible: false
    }))
    wall3.rotateY(-Math.PI / 2);
    wall4.rotateY(-Math.PI / 2);
    wall1.position.set(-550, 12.5, 0);
    wall2.position.set(-50, 12.5, 0);
    wall3.position.set(-300, 12.5, -250);
    wall4.position.set(-300, 12.5, 250);
    scene.add(wall1, wall2, wall3, wall4);
    wallObjects.push(wall1, wall2, wall3, wall4);

    //鼠标上移的roll-over方块
    var rollOverGeo = new THREE.BoxGeometry(50, 25, 50);
    rollOverMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.5,
        transparent: true
    });
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);

    //标记击中或未击中的方块
    markCubeMaterial1 = new THREE.MeshBasicMaterial({
        color: 0x66bb6a,
        opacity: 0.5,
        transparent: true
    });
    markCubeMaterial2 = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.5,
        transparent: true
    });

    //战舰1-5
    cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xe0e0e0
    })
    accGeo = new THREE.Mesh(new THREE.BoxGeometry(50, 25, 250), cubeMaterial);
    btsGeo = new THREE.Mesh(new THREE.BoxGeometry(50, 25, 250), cubeMaterial);
    fgGeo = new THREE.Mesh(new THREE.BoxGeometry(50, 25, 150), cubeMaterial);
    sbmGeo = new THREE.Mesh(new THREE.BoxGeometry(50, 25, 150), cubeMaterial);
    msprGeo = new THREE.Mesh(new THREE.BoxGeometry(50, 25, 50), cubeMaterial);
    accGeo.position.set(-500, 25, 400);
    btsGeo.position.set(-400, 25, 400);
    fgGeo.position.set(-300, 25, 350);
    sbmGeo.position.set(-200, 25, 350);
    msprGeo.position.set(-100, 25, 300);
    fgGeo.rotateY(2 * Math.PI);
    scene.add(accGeo, btsGeo, fgGeo, sbmGeo, msprGeo);
    boardObjects.push(accGeo, btsGeo, fgGeo, sbmGeo, msprGeo);
    boatObjects.push(accGeo, btsGeo, fgGeo, sbmGeo, msprGeo);

    //渲染
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    //添加事件监听
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('keydown', onDocumentKeyDown, false);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//渲染函数
function render() {
    renderer.render(scene, camera);
}

//鼠标移动事件
function onDocumentMouseMove(event) {
    if (plaecdBoat) { //选中战舰后,显示鼠标在面板一的位置
        let intersects = judgeObjects(event, plane1Objects);
        if (intersects.length > 0) {
            let intersect = intersects[0];
            scene.add(rollOverMesh);
            rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
            rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
            currentBoat.position.copy(intersect.point).add(intersect.face.normal);
            currentBoat.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        }
    } else if (plaecdBoatNum === 5) {
        let intersects = judgeObjects(event, plane2Objects);
        if (intersects.length > 0) {
            let intersect = intersects[0];
            scene.add(rollOverMesh);
            rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
            rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        }
    }
    render();
}

//鼠标点击事件
function onDocumentMouseDown(event) {
    if (!plaecdBoat) { //战舰的选择
        rotateCount = 0;
        let intersects = judgeObjects(event, boardObjects);
        if (intersects.length > 0) {
            let intersect = intersects[0];
            if (intersect.object != board) {
                currentBoat = intersect.object;
                plaecdBoat = true;
                render();
            }
        }
    } else { //选中战舰后,当前战舰的放置
        let intersects = judgeObjects(event, plane1Objects);
        if (intersects.length > 0) {
            let intersect = intersects[0];
            var isCollision1 = judgeCollision(boatObjects, currentBoat); //判断当前战舰与其他战舰的重合
            var isCollision2 = judgeCollision(wallObjects, currentBoat); //判断当前战舰是否超出平面
            if (intersect.object == plane1 && !isCollision1 && !isCollision2) {
                scene.remove(rollOverMesh);
                currentBoat.position.copy(intersect.point).add(intersect.face.normal);
                currentBoat.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                plane1Objects.push(currentBoat);
                boardObjects.splice(boardObjects.indexOf(currentBoat), 1);
                plaecdBoat = false;
                if (currentBoat === accGeo) {
                    setPlayerArray(5)
                    plaecdBoatNum++;
                } else if (currentBoat === btsGeo) {
                    setPlayerArray(4)
                    plaecdBoatNum++;
                } else if (currentBoat === fgGeo) {
                    setPlayerArray(3)
                    plaecdBoatNum++;
                } else if (currentBoat === sbmGeo) {
                    setPlayerArray(2)
                    plaecdBoatNum++;
                } else if (currentBoat === msprGeo) {
                    setPlayerArray(1)
                    plaecdBoatNum++;
                }
                if (plaecdBoatNum === 5) {
                    alert("GAME START!")
                    for (let i = 0; i < 8; i++) {
                        for (let j = 0; j < 8; j++) {
                            playerGrids[i][j] = grids[i][j]
                        }
                    }
                    startGame();
                }
                render();
            }
        }
    }
    if (plaecdBoatNum === 5 && !attackStatus) {
        let intersects = judgeObjects(event, plane2Objects);
        if (intersects.length > 0) {
            let intersect = intersects[0];
            if (intersect.object == plane2) {
                currentGridX = Math.floor((rollOverMesh.position.z + 200) / 50);
                currentGridY = (rollOverMesh.position.x - 125) / 50;
                var markCubeGeo = new THREE.BoxGeometry(50, 25, 50);
                if (computerGrids[currentGridX][currentGridY] !== 0 && computerGrids[currentGridX][currentGridY] !== 'x') {
                    computerGrids[currentGridX][currentGridY] = 'x';
                    markCube = new THREE.Mesh(markCubeGeo, markCubeMaterial1);
                    markCube.position.copy(intersect.point).add(intersect.face.normal);
                    markCube.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    scene.add(markCube);
                    render();
                    hitCount++;
                    if (!computer.testBoat(computerGrids)) {
                        endGame(true);
                    }
                } else if (computerGrids[currentGridX][currentGridY] === 0) {
                    computerGrids[currentGridX][currentGridY] = 'x';
                    markCube = new THREE.Mesh(markCubeGeo, markCubeMaterial2);
                    markCube.position.copy(intersect.point).add(intersect.face.normal);
                    markCube.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    scene.add(markCube);
                    render();
                    missCount--;
                    attackStatus = true;
                    var attackInterval = setInterval(function () {
                        if (attackStatus) {
                            computerTurn();
                        } else {
                            clearInterval(attackInterval);
                        }
                    }, 500)
                }
            }
        }
    }
}
//发射射线,与模型求交
function judgeObjects(event, objects) {
    event.preventDefault();
    mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects);
    return intersects
}

//判断模型是否重合
function judgeCollision(objects, currentBoat) {
    var originPoint = currentBoat.position.clone();
    var collision;
    for (var vertexIndex = 0; vertexIndex < currentBoat.geometry.vertices.length; vertexIndex++) {
        var localVertex = currentBoat.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(currentBoat.matrix); //本地坐标乘以变换矩阵得世界坐标
        var directionVector = globalVertex.sub(currentBoat.position); // 中心指向顶点的向量
        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize()); // 初始化方向向量
        var collisionResults = ray.intersectObjects(objects); // 检测射线与多个物体的相交
        // 交点与射线起点的距离小于物体中心至顶点的距离，则发生了碰撞
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            collision = true;
        }
    }
    return collision
}
//监听左右键
function onDocumentKeyDown(event) {
    if (plaecdBoat) {
        switch (event.keyCode) {
            case 37:
                rotateCount++;
                currentBoat.rotateY(Math.PI / 2);
                break;

            case 39:
                rotateCount++;
                currentBoat.rotateY(Math.PI / 2);
                break;
        }
    }
    render();
}

function setPlayerArray(num) { //玩家放置的战舰对应的数组
    var currentBoatPoints = [];
    var pointsNum = currentBoat.geometry.parameters.depth / 50
    for (let i = 0; i < pointsNum; i++) {
        currentBoatPoints[i] = [];
    }
    //将当前船的坐标换算成数组坐标
    var middleX = Math.floor((currentBoat.position.z + 200) / 50);
    var middleY = (currentBoat.position.x + 475) / 50;
    currentBoatPoints[(pointsNum - 1) / 2][0] = middleX;
    currentBoatPoints[(pointsNum - 1) / 2][1] = middleY;
    if (rotateCount % 2 === 0) {
        for (let i = (pointsNum - 1) / 2 - 1; i >= 0; i--) {
            currentBoatPoints[i][0] = currentBoatPoints[i + 1][0] - 1;
            currentBoatPoints[i][1] = currentBoatPoints[i + 1][1];
        }
        for (let i = (pointsNum - 1) / 2 + 1; i < pointsNum; i++) {
            currentBoatPoints[i][0] = currentBoatPoints[i - 1][0] + 1;
            currentBoatPoints[i][1] = currentBoatPoints[i - 1][1];
        }
    } else {
        for (let i = (pointsNum - 1) / 2 - 1; i >= 0; i--) {
            currentBoatPoints[i][0] = currentBoatPoints[i + 1][0];
            currentBoatPoints[i][1] = currentBoatPoints[i + 1][1] - 1;
        }
        for (let i = (pointsNum - 1) / 2 + 1; i < pointsNum; i++) {
            currentBoatPoints[i][0] = currentBoatPoints[i - 1][0];
            currentBoatPoints[i][1] = currentBoatPoints[i - 1][1] + 1;
        }
    }
    for (let i = 0; i < pointsNum; i++) {
        grids[currentBoatPoints[i][0]][currentBoatPoints[i][1]] = num;
    }
}

function computerTurn() { //电脑攻击玩家
    let markCubeGeo = new THREE.BoxGeometry(50, 25, 50);
    if (playerGrids[pointsMin[playCounts][0]][pointsMin[playCounts][1]] !== 0) {
        playerGrids[pointsMin[playCounts][0]][pointsMin[playCounts][1]] = 'x';
        markCube = new THREE.Mesh(markCubeGeo, markCubeMaterial1);
        markCube.position.set(pointsMin[playCounts][1] * 50 - 475, 25, (pointsMin[playCounts][0] + 0.5) * 50 - 200);
        scene.add(markCube);
    } else {
        playerGrids[pointsMin[playCounts][0]][pointsMin[playCounts][1]] = 'x';
        markCube = new THREE.Mesh(markCubeGeo, markCubeMaterial2);
        markCube.position.set(pointsMin[playCounts][1] * 50 - 475, 25, (pointsMin[playCounts][0] + 0.5) * 50 - 200)
        scene.add(markCube);
        attackStatus = false;
    }
    playCounts++;
    if (!computer.testBoat(playerGrids)) {
        setTimeout(function () {
            endGame(false)
        }, 1000)
    }
}

function startGame() {
    computer.placeShip();
    computerGrids = computer.grids;
    computer.getFastMethod(grids);
    
    pointsMin = computer.pointsMin;
    maxCounts = pointsMin.length;
}

function endGame(endGame) {
    var accGeoNum = 0,
        btsGeoNum = 0,
        fgGeoNum = 0,
        sbmGeoNum = 0,
        msprGeoNum = 0;
    var grades;
    if (endGame) {
        grades = hitCount * 100 - missCount * 50 + 50 * 5;
        alert("You Win!Your grades:" + grades + ".");
        var name = prompt("请输入您的名字", "")
        if (name != null && name != "") {
            localStorage.setItem(name, grades)
        }
        location.reload();
    } else {
        for (let i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
                if (computerGrids[i][j] === 5) {
                    accGeoNum = 1;
                } else if (computerGrids[i][j] === 4) {
                    btsGeoNum = 1;
                } else if (computerGrids[i][j] === 3) {
                    fgGeoNum = 1;
                } else if (computerGrids[i][j] === 2) {
                    sbmGeoNum = 1;
                } else if (computerGrids[i][j] === 1) {
                    msprGeoNum = 1;
                }
            }
        }
        var hittingBoatNum = accGeoNum + btsGeoNum + fgGeoNum + sbmGeoNum + msprGeoNum;
        grades = hitCount * 100 - missCount * 50 + 50 * hittingBoatNum;
        alert("You Lose!Your grades:" + grades + ".");
        location.reload();
    }
}