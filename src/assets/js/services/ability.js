import { Ability, AbilityBuilder, defineAbility } from '@casl/ability';
import { useAbility } from '@casl/vue';

/*
CASL uses can and cannot function names to both define and check permissions. For some of you, it may look confusing and you would like to be more explicit and not rely on the execution context.
*/

// these are RBAC.
// Others like if wallet connected or not can be handled using ABAC.
// Only use defineAbilitiesFor when you don't have any UI specific temporary
// permissions set example ('connected', 'Wallet').
// hence use it only on initial renders or resets
const ROLES = ['anyone', 'journalist', 'admin'];
function defineAbilitiesFor(role) {
  const abilityBuilder = new AbilityBuilder(Ability);
  const { can, rules, build } = abilityBuilder;
  const is = (r) => ROLES.indexOf(role) >= ROLES.indexOf(r);

  if (is('anyone')) {
    can('read', 'News');
  }

  if (is('journalist')) {
    can('authenticated');
    can('manage', 'News');
  }

  if (is('admin')) {
    can('manage', 'all');
  }

  const ability = build({
    detectSubjectType: (object) => object.__typename,
  });
  return { rules, ability, abilityBuilder };
}

// Global ability and abilityBuilder instance
const { ability, abilityBuilder } = defineAbilitiesFor('anyone');
const { rules } = abilityBuilder;

// logging before updates
const unsubscribe = ability.on('update', ({ rules, target }) => {
  // `rules` is an array passed to `update` method
  // `target` is an Ability instance that triggered event
  console.log(rules);
});
// unsubscribe() // removes subscription

// utility functions
const deny = (a, s) => {
  console.log('before', rules);
  // TODO: can be made better by taking array of permissions
  let length = rules.length;
  for (let i = length - 1; i >= 0; i--) {
    let r = rules[i];
    if (r.action === a && r.subject === s) {
      rules.splice(i, 1);
    }
  }
  console.log('after', rules);
  return rules;
};

export { ability, useAbility, abilityBuilder, defineAbilitiesFor, deny };
