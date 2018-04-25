// @flow

/// Starting in the top (left) going clockwise
type Direction = 0 | 1 | 2 | 3 | 4 | 5;

class Hexagon {}

export class CubeCoordinate {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toAxial(): AxialCoordinate {
        const col = this.x + (this.z - (this.z & 1)) / 2;
        const row = this.z;

        return new AxialCoordinate(col, row);
    }

    distanceTo(other: CubeCoordinate): number {
        return Math.max(
            Math.abs(this.x - other.x),
            Math.abs(this.y - other.y),
            Math.abs(this.z, other.z)
        );
    }

    round(): CubeCoordinate {
        let rx = Math.round(this.x);
        let ry = Math.round(this.y);
        let rz = Math.round(this.z);

        const xDiff = Math.abs(rx - this.x);
        const yDiff = Math.abs(ry - this.y);
        const zDiff = Math.abs(rz - this.z);

        if (xDiff > yDiff && xDiff > zDiff) rx = -ry - rz;
        else if (yDiff > zDiff) ry = -rx - rz;
        else rz = -rx - ry;

        return new CubeCoordinate(rx, ry, rz);
    }

    drawLineTo(other: CubeCoordinate) {
        const linearInterpolation = (a, b, t) => a + (b - a) * t;
        const cubeLinearInterpolation = (a, b, t) =>
            new CubeCoordinate(
                linearInterpolation(a.x, b.x, t),
                linearInterpolation(a.y, b.y, t),
                linearInterpolation(a.z, b.z, t)
            );

        const pointCount = this.distanceTo(other);
        const intersectedCoordinates = [];
        for (let i = 0; i <= pointCount; i++)
            intersectedCoordinates.push(
                cubeLinearInterpolation(
                    this,
                    other,
                    1.0 / pointCount * i
                ).round()
            );

        return intersectedCoordinates;
    }
}

export class AxialCoordinate {
    q: number;
    r: number;

    get s() {
        return -this.q - this.r;
    }

    static directions = [
        new AxialCoordinate(+0, -1),
        new AxialCoordinate(+1, -1),
        new AxialCoordinate(+1, +0),
        new AxialCoordinate(+0, +1),
        new AxialCoordinate(-1, +1),
        new AxialCoordinate(-1, +0)
    ];

    static diagonalDirections = [
        new AxialCoordinate(-1, -1),
        new AxialCoordinate(+1, -2),
        new AxialCoordinate(+2, -1),
        new AxialCoordinate(+1, +1),
        new AxialCoordinate(-1, +2),
        new AxialCoordinate(-2, +1)
    ];

    constructor(q: number, r: number) {
        this.q = q;
        this.r = r;
    }

    toCube(): CubeCoordinate {
        const x = this.q - (this.r - (this.r & 1)) / 2;
        const z = this.r;
        const y = this.s;

        return new CubeCoordinate(x, y, z);
    }

    add(other: AxialCoordinate): AxialCoordinate {
        return new AxialCoordinate(this.q + other.q, this.r + other.r);
    }

    getNeighbor(direction: Direction) {
        return this.add(AxialCoordinate.directions[direction]);
    }

    getDiagonalNeighbor(direction: Direction) {
        return this.add(AxialCoordinate.diagonalDirections[direction]);
    }

    distanceTo(other: AxialCoordinate) {
        return this.toCube().distanceTo(other.toCube());
    }
}

class Map {}
