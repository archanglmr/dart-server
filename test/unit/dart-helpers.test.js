'use strict';

var assert = require('chai').assert,
    DartHelpers = require('../../lib/dart-helpers'),
    Sig = DartHelpers.Signature;

describe('DartHelper.Signature', () => {

    describe('.encodeModifiers(string)', () => {
        describe('normalizes modifiers', () => {
            it('sorts', () => assert.equal('noscore:true|rounds:5|timelimit:1500', Sig.encodeModifiers({noscore: true, timelimit: 1500, rounds: 5})));
            it('lower case sorts', () => assert.equal('noscore:true|rounds:5|timelimit:1500', Sig.encodeModifiers({noScore: true, timeLimit: 1500, Rounds: 5})));
        });

        /* @todo: test handling of bad data */
    });


    describe('.decodeModifiers(object)', () => {
        /* @todo: test handling of good data */

        describe('handles malformed data', () => {
            it('empty string: \'\'', () => assert.deepEqual({}, Sig.decodeModifiers('')));
            it('empty object: {}', () => assert.deepEqual({}, Sig.decodeModifiers({})));
            it('empty array: []', () => assert.deepEqual({}, Sig.decodeModifiers([])));
            it('null', () => assert.deepEqual({}, Sig.decodeModifiers(null)));
            it('false', () => assert.deepEqual({}, Sig.decodeModifiers(false)));
            it('integer', () => assert.deepEqual({}, Sig.decodeModifiers(156)));
        });
    });


    describe('.encodeSignature(string, string, string, object)', () => {
        describe('normalizes modifiers', () => {
            it('sorts', () => assert.equal('cricket/regular/1.1/noscore:true|rounds:5|timelimit:1500',
                Sig.encode('cricket', 'regular', '1.1', {noscore: true, timelimit: 1500, rounds: 5})));
            it('lower case sorts', () => assert.equal('cricket/hidden/1.1/noscore:true|rounds:5|timelimit:1500',
                Sig.encode('cricket', 'hidden', '1.1', {noScore: true, timeLimit: 1500, Rounds: 5})))
        });
    });


    describe('.decodeSignature(string)', () => {
        it('with modifiers', () => {
            var decoded = Sig.decode('01/501/1.0/rounds:25|time:30m|round:1m');

            assert.equal('01', decoded.type);
            assert.equal('501', decoded.variation);
            assert.equal('1.0', decoded.version);
            assert.deepEqual({round: '1m', rounds: '25', time: '30m'}, decoded.modifiers);
        });

        it('without modifiers', () => {
            var decoded = Sig.decode('cricket/hidden/6.2.3/');

            assert.equal('cricket', decoded.type);
            assert.equal('hidden', decoded.variation);
            assert.equal('6.2.3', decoded.version);
            assert.deepEqual({}, decoded.modifiers);
        });

        describe('handles malformed data', () => {
            it('to many /\'s', () => assert.equal(false, Sig.decode('cricket/hidden/6.2.3/xyz/abc')));
            it('empty string: \'\'', () => assert.equal(false, Sig.decode('')));
            it('empty object: {}', () => assert.equal(false, Sig.decode({})));
            it('empty array: []', () => assert.equal(false, Sig.decode([])));
            it('null', () => assert.equal(false, Sig.decode(null)));
            it('false', () => assert.equal(false, Sig.decode(false)));
            it('integer', () => assert.equal(false, Sig.decode(156)));
        });
    });
});