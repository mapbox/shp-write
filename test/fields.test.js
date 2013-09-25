var expect = require('expect.js'),
    fields = require('../src/fields');

describe('fields', function() {
    describe('obj', function() {
        it('null', function() {
            expect(fields.obj({})).to.eql({});
        });

        it('string', function() {
            expect(fields.obj({
                foo: 'bar'
            })).to.eql([{
                name: 'foo',
                type: 'C'
            }]);
        });

        it('number', function() {
            expect(fields.obj({
                foo: 2
            })).to.eql([{
                name: 'foo',
                type: 'N'
            }]);
        });

        it('boolean', function() {
            expect(fields.obj({
                foo: true
            })).to.eql([{
                name: 'foo',
                type: 'L'
            }]);
        });
    });
});
