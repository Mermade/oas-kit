'use strict';

const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');
const should = require('should/as-function');

let rules = [];

function loadRules(s) {
    let data = fs.readFileSync(s,'utf8');
    let newRules = yaml.safeLoad(data,{json:true}).rules;

    for (let rule of newRules) {
        if (!Array.isArray(rule.object)) rule.object = [ rule.object ];
        if (rule.truthy && !Array.isArray(rule.truthy)) rule.truthy = [ rule.truthy ];
    }
    newRules = newRules.filter(function(e){ return !e.disabled; });

    let hash = new Map();
    rules.concat(newRules).forEach(function(rule) {
        hash.set(rule.name, Object.assign(hash.get(rule.name) || {}, rule));
    });
    rules = Array.from(hash.values());
}

function lint(objectName,object,key,options) {
    for (let rule of rules) {
        if ((rule.object[0] === '*') || (rule.object.indexOf(objectName)>=0)) {
            options.lintRule = rule;
            if (rule.skip && options[rule.skip]) {
                continue;
            }
            if (rule.truthy) {
                for (let property of rule.truthy) {
                    should(object).have.property(property);
                    should(object[property]).not.be.empty();
                }
            }
            if (rule.properties) {
                should(Object.keys(object).length).be.exactly(rule.properties);
            }
            if (rule.or) {
                let found = false;
                for (let property of rule.or) {
                    if (typeof object[property] !== 'undefined') found = true;
                }
                should(found).be.exactly(true,rule.description);
            }
            if (rule.xor) {
                let found = false;
                for (let property of rule.xor) {
                    if (typeof object[property] !== 'undefined') {
                        if (found) should.fail(true,false,rule.description);
                        found = true;
                    }
                }
                should(found).be.exactly(true,rule.description);
            }
            if (rule.pattern) {
                let components = [];
                if (rule.pattern.split) {
                    components = object[rule.pattern.property].split(rule.pattern.split);
                }
                else {
                    components.push(object[rule.pattern.property]);
                }
                let re = new RegExp(rule.pattern.value);
                for (let component of components) {
                    if (rule.pattern.omit) component = component.split(rule.pattern.omit).join('');
                    if (component) {
                        should(re.test(component)).be.exactly(true,rule.description);
                    }
                }
            }
            if (rule.notContain) {
                for (let property of rule.notContain.properties) {
                    if (object[property] && (typeof object[property] === 'string') &&
                        (object[property].indexOf(rule.notContain.value)>=0)) {
                        should.fail(true,false,rule.description);
                    }
                }
            }
            if (rule.notEndWith) {
                let property = (rule.notEndWith.property === '$key') ? key : object[rule.notEndWith.property];
                if (typeof property === 'string') {
                    if (rule.notEndWith.omit) {
                        property = property.replace(rule.notEndWith.omit,'');
                    }
                    should(property).not.endWith(rule.notEndWith.value);
                }
            }
            if (rule.if) {
                let property = (rule.if.property === '$key') ? key : object[rule.if.property];
                if (property) {
                  let thenProp = (rule.if.then.property === '$key') ? key : object[rule.if.then.property];
                  should(thenProp).equal(rule.if.then.value);
                }
            }
            // TODO speccy defines a maxLength rule { property: string, value: integer }
        }
    }
    delete options.lintRule;
}

loadRules(path.join(__dirname,'rules.yaml'));

module.exports = {
    lint : lint,
    loadRules : loadRules,
    getRules : function() { return { rules: rules }; }
};

