"use strict"

function Computer() {
    this.pointsMin = [];
    this.points = [];
    this.pointsMin = this.constructArray([], 64, 2);
    this.grids = this.constructArray([], 8, 8);
}
Computer.prototype = {
    placeShip: function () { //电脑随机放置战舰
        var accGeo = this.constructArray([], 5, 2);
        var btsGeo = this.constructArray([], 5, 2);
        var fgGeo = this.constructArray([], 3, 2);
        var sbmGeo = this.constructArray([], 3, 2);
        var msprGeo = this.constructArray([], 1, 2);
        this.accGeo = this.setNumber(this.judgeDirection(accGeo), accGeo, 5);
        this.btsGeo = this.setNumber(this.judgeDirection(btsGeo), btsGeo, 4);
        this.fgGeo = this.setNumber(this.judgeDirection(fgGeo), fgGeo, 3);
        this.sbmGeo = this.setNumber(this.judgeDirection(sbmGeo), sbmGeo, 2);
        this.msprGeo = this.setNumber(this.judgeDirection(msprGeo), msprGeo, 1);
    },
    constructArray: function (array, a, b) { //构造二维数组
        for (let i = 0; i < a; i++) {
            array[i] = [];
        }
        for (let i = 0; i < a; i++) {
            for (let j = 0; j < b; j++) {
                array[i][j] = 0;
            }
        }
        return array
    },
    judgeDirection: function (array) { //判断战舰的方向
        this.startPointX = Math.round(Math.random() * 7);
        this.startPointY = Math.round(Math.random() * 7);
        this.boatLength = array.length;
        var startPointX = this.startPointX;
        var startPointY = this.startPointY;
        var boatLength = this.boatLength;
        var grids = this.grids;
        var direction;
        var firstJudgeDirection = Math.round(Math.random() * 3);
        if (firstJudgeDirection === 0) {
            for (let i = 0; i < boatLength; i++) {
                if (!grids[startPointX - boatLength] || grids[startPointX - i][startPointY] !== 0) {
                    if (!grids[startPointX][startPointY + boatLength] || grids[startPointX][startPointY + i] !== 0) {
                        if (!grids[startPointX + boatLength] || grids[startPointX + i][startPointY] !== 0) {
                            if (!grids[startPointX][startPointY - boatLength] || grids[startPointX][startPointY - i] !== 0) {
                                if (direction = this.judgeDirection(array)) {
                                    return direction
                                }
                            } else {
                                direction = 'left'
                            }
                        } else {
                            direction = 'down'
                        }
                    } else {
                        direction = 'right'
                    }
                } else {
                    direction = 'up'
                }
            }
        }
        if (firstJudgeDirection === 1) {
            for (let i = 0; i < boatLength; i++) {
                if (!grids[startPointX][startPointY + boatLength] || grids[startPointX][startPointY + i] !== 0) {
                    if (!grids[startPointX + boatLength] || grids[startPointX + i][startPointY] !== 0) {
                        if (!grids[startPointX][startPointY - boatLength] || grids[startPointX][startPointY - i] !== 0) {
                            if (!grids[startPointX - boatLength] || grids[startPointX - i][startPointY] !== 0) {
                                if (direction = this.judgeDirection(array)) {
                                    return direction
                                }
                            } else {
                                direction = 'up'
                            }
                        } else {
                            direction = 'left'
                        }
                    } else {
                        direction = 'down'
                    }
                } else {
                    direction = 'right'
                }
            }
        }
        if (firstJudgeDirection === 2) {
            for (let i = 0; i < boatLength; i++) {
                if (!grids[startPointX + boatLength] || grids[startPointX + i][startPointY] !== 0) {
                    if (!grids[startPointX][startPointY - boatLength] || grids[startPointX][startPointY - i] !== 0) {
                        if (!grids[startPointX - boatLength] || grids[startPointX - i][startPointY] !== 0) {
                            if (!grids[startPointX][startPointY + boatLength] || grids[startPointX][startPointY + i] !== 0) {
                                if (direction = this.judgeDirection(array)) {
                                    return direction
                                }
                            } else {
                                direction = 'right'
                            }
                        } else {
                            direction = 'up'
                        }
                    } else {
                        direction = 'left'
                    }
                } else {
                    direction = 'down'
                }
            }
        }
        if (firstJudgeDirection === 3) {
            for (let i = 0; i < boatLength; i++) {
                if (!grids[startPointX][startPointY - boatLength] || grids[startPointX][startPointY - i] !== 0) {
                    if (!grids[startPointX - boatLength] || grids[startPointX - i][startPointY] !== 0) {
                        if (!grids[startPointX][startPointY + boatLength] || grids[startPointX][startPointY + i] !== 0) {
                            if (!grids[startPointX + boatLength] || grids[startPointX + i][startPointY] !== 0) {
                                if (direction = this.judgeDirection(array)) {
                                    return direction
                                }
                            } else {
                                direction = 'down'
                            }
                        } else {
                            direction = 'right'
                        }
                    } else {
                        direction = 'up'
                    }
                } else {
                    direction = 'left'
                }
            }
        }
        return direction
    },
    setNumber: function (direction, array, number) {
        var startPointX = this.startPointX;
        var startPointY = this.startPointY;
        var boatLength = this.boatLength;
        for (let i = 0; i < boatLength; i++) {
            if (direction === 'up') {
                this.grids[startPointX - i][startPointY] = number;
                array[i][0] = startPointX - i;
                array[i][1] = startPointY;
            } else if (direction === 'right') {
                this.grids[startPointX][startPointY + i] = number;
                array[i][0] = startPointX;
                array[i][1] = startPointY + i;
            } else if (direction === 'down') {
                this.grids[startPointX + i][startPointY] = number;
                array[i][0] = startPointX + i;
                array[i][1] = startPointY;
            } else if (direction === 'left') {
                this.grids[startPointX][startPointY - i] = number;
                array[i][0] = startPointX;
                array[i][1] = startPointY - i;
            }
        }
        return array
    },
    attackBoats: function (grids) { //电脑攻击玩家的战舰
        for (let i = 1; i < 1000; i++) {
            this.PointX = Math.round(Math.random() * 7);
            this.PointY = Math.round(Math.random() * 7);
            var PointX = this.PointX;
            var PointY = this.PointY;
            if (!this.testBoat(grids)) {
                break;
            }
            if (grids[PointX][PointY] !== 'x') {
                this.points.push([this.PointX, this.PointY]);
                if (grids[PointX][PointY] !== 0) {
                    grids[PointX][PointY] = 'x';
                    for (let i = 1; i < 10; i++) {
                        if (grids[PointX - i] && grids[PointX - i][PointY] !== 0 && grids[PointX - i][PointY] !== 'x') {
                            grids[PointX - i][PointY] = 'x'
                            this.points.push([PointX - i, PointY]);
                        }
                        if (grids[PointX][PointY + i] && grids[PointX][PointY + i] !== 0 && grids[PointX][PointY + i] !== 'x') {
                            grids[PointX][PointY + i] = 'x'
                            this.points.push([PointX, PointY + i]);
                        }
                        if (grids[PointX + i] && grids[PointX + i][PointY] !== 0 && grids[PointX + i][PointY] !== 'x') {
                            grids[PointX + i][PointY] = 'x';
                            this.points.push([PointX + i, PointY]);
                        }
                        if (grids[PointX][PointY - i] && grids[PointX][PointY - i] !== 0 && grids[PointX][PointY - i] !== 'x') {
                            grids[PointX][PointY - i] = 'x';
                            this.points.push([PointX, PointY - i]);
                        }
                    }
                } else {
                    grids[PointX][PointY] = 'x';
                }
            }
        }
    },
    testBoat: function (grids) { //检测是否还有船未被击沉
        var existBoat = false;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (grids[i][j] !== 0 && grids[i][j] !== 'x') {
                    existBoat = true
                }
            }
        }
        return existBoat
    },
    getFastMethod: function (grids) { //取10次攻击中最快的一种
        var currentsGrids=this.constructArray([], 8, 8);
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                currentsGrids[i][j]=grids[i][j];
            }
        }
        for (let i = 0; i < 10; i++) {
            this.points = [];
            for(let i=0;i<8;i++){
                for(let j=0;j<8;j++){
                    grids[i][j]=currentsGrids[i][j];
                }
            }
            this.attackBoats(grids);
            if (this.pointsMin.length > this.points.length && this.points.length) {
                this.pointsMin=[];
                for(let i=0;i<this.points.length;i++){
                    this.pointsMin.push(this.points[i]);
                }
            }
        }
    }
}