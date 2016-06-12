'use strict';

module.exports.Signature = class SignatureHelper {
  /**
   * Encodes a modifiers object
   *
   * @param {object} modifiers
   * @returns {string}
   */
  static encodeModifiers(modifiers) {
    var keys = [],
        encoded = [],
        keyMap = {};

    for (let k in modifiers) {
      if (modifiers.hasOwnProperty(k)) {
        let lower = k.toLowerCase();
        keyMap[lower] = k;
        keys.push(lower);
      }
    }

    keys.sort();

    for (let i = 0, c = keys.length; i < c; i += 1) {
      let key = keys[i];
      encoded.push(`${key}:${modifiers[keyMap[key]]}`);
    }

    return encoded.join('|');
  }

  /**
   * Decodes a modifiers string (the reverse of encodeModifiers)
   *
   * @param {string} modifiersStr
   * @returns {object}
   */
  static decodeModifiers(modifiersStr) {
    var parts = (modifiersStr && modifiersStr.split) ? modifiersStr.split('|') : [],
        modifiers = {};

    for (let i = 0, c = parts.length; i < c; i += 1) {
      let [key, value] = parts[i].split(':', 2);
      if (key) {
        modifiers[key] = value;
      }
    }

    return modifiers;
  }

  /**
   * Takes the variables needed to build a game signature and return one all
   * nice and clean.
   *
   * @param {string} type
   * @param {string} variation
   * @param {string} version
   * @param {object} modifiers
   * @returns {string}
   */
  static encode(type, variation, version, modifiers) {
    if (1 === arguments.length) {
      var {type, variation, version, modifiers} = type;
    }
    return [type, variation, version, SignatureHelper.encodeModifiers(modifiers)].join('/').toLowerCase();
  }

  /**
   * Takes a game signature and decodes it
   *
   * @param {string} signature
   * @returns {{type: {string}, variation: {string}, version: {string}, modifiers: ({}|*)}}
   */
  static decode(signature) {
    if (signature && 'string' === typeof signature && 3 === (signature.match(/\//g) || []).length) {
      var [type, variation, version, tmpModifiers] = signature.split('/'),
          modifiers = SignatureHelper.decodeModifiers(tmpModifiers);

      return {type, variation, version, modifiers};
    }
    return false;
  }
};