import { Ability, AbilityBuilder } from '@casl/ability';
import { useAbility } from '@casl/vue';

/*
CASL uses can and cannot function names to both define and check permissions. For some of you, it may look confusing and you would like to be more explicit and not rely on the execution context.
*/
const abilityBuilder = new AbilityBuilder(Ability);
// defines abilities
const { can: allow, cannot: forbid, rules, build } = abilityBuilder;

const ability = build({
  detectSubjectType: (object) => object.__typename,
});

const unsubscribe = ability.on('update', ({ rules, target }) => {
  // `rules` is an array passed to `update` method
  // `target` is an Ability instance that triggered event
  console.log(rules);
});
// unsubscribe() // removes subscription

export { ability, useAbility, abilityBuilder };
