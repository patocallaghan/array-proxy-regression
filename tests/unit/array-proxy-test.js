import { module, test } from 'ember-qunit';
import EmberObject, { computed } from '@ember/object';
import ArrayProxy from '@ember/array/proxy';
import { A } from '@ember/array';
import { on } from '@ember/object/evented';

module('Array Proxy Regression', function() {
  const EntityList = ArrayProxy.extend({
    setup: on('init', function() {
      this.set('content', A());
    }),

    toggle(options) {
      this.pushObjects([EmberObject.create(options)]);
    },
  });

  const Block = EmberObject.extend({
    init() {
      this.set('entities', EntityList.create());
    },

    innerHtml: computed('entities.@each.{startIndex,endIndex}', function() {
      return this.entities
        .map(entity => `${entity.startIndex}:${entity.endIndex}`)
        .join(' ');
    }),

    toggleEntity(options) {
      this.entities.toggle(options);
    },
  });

  test('entities', function(assert) {
    let block;
    block = Block.create({ text: 'orange green blue red' });

    block.toggleEntity({ startIndex: 0, endIndex: 6 });
    assert.equal(block.innerHtml, '0:6', 'a range can be bolded');

    block.toggleEntity({ startIndex: 13, endIndex: 17 });
    assert.equal(block.innerHtml, '0:6 13:17', 'multiple ranges can be bolded');
  });
})