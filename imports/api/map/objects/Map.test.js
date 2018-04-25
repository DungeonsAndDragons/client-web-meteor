import { AxialCoordinate, CubeCoordinate, Directions } from './Map';
import assert from 'assert';

describe('Coordinate systems', function() {
    it('Conversion between Axial and Cube representation', function() {
        const a = new AxialCoordinate(1, 0);
        const b = new CubeCoordinate(1, -1, 0);

        assert.deepEqual(a, b.toAxial());
        assert.deepEqual(b, a.toCube());
        assert.deepEqual(a, a.toCube().toAxial());
    });

    it('Calculate immediate and diagonal neighbors based on a direction', function() {
        const a = new AxialCoordinate(1, 1);
        const b = new AxialCoordinate(0, 1);
        const c = new AxialCoordinate(0, 0);

        assert.deepEqual(a.getNeighbor(5), b);
        assert.deepEqual(a.getDiagonalNeighbor(0), c);
    });

    it('Calculate distances in cube coordinates', function() {
        const a = new CubeCoordinate(0, 0, 0);
        const b = new CubeCoordinate(1, 3, 2);

        assert.equal(a.distanceTo(b), 3);
    });

    it('Draw a line between two points', function() {
        const a = new CubeCoordinate(0, 0, 0);
        const b = new CubeCoordinate(0, -3, 3);
        const c = new CubeCoordinate(1, -3, 2);

        const lineAB = [
            a,
            new CubeCoordinate(0, -1, 1),
            new CubeCoordinate(0, -2, 2),
            b
        ];

        const lineAC = [
            a,
            new CubeCoordinate(0, -1, 1),
            new CubeCoordinate(1, -2, 1),
            c
        ];

        assert.deepEqual(a.drawLineTo(b), lineAB);
        assert.deepEqual(a.drawLineTo(c), lineAC);
    });
});
