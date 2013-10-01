var expect = require('expect.js'),
    fields = require('../src/fields');

describe('fields', function() {

    describe('#obj', function() {
        it('field types', function() {
            expect(fields.obj({ foo: 'bar' }))
                .to.eql([{ name: 'foo', type: 'C' }]);

            expect(fields.obj({ foo: true }))
                .to.eql([{ name: 'foo', type: 'L' }]);

            expect(fields.obj({ foo: 10 }))
                .to.eql([{ name: 'foo', type: 'N' }]);
        });
    });
});
