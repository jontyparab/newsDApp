import { Ability, AbilityBuilder } from '@casl/ability';
import { useAbility } from '@casl/vue';

// const Actions = 'create' | 'read' | 'update' | 'delete';
// const Subjects = 'Article' | 'User';

const abilityBuilder = new AbilityBuilder(Ability);
const { can, cannot, rules, build } = abilityBuilder;

can('read', 'User');

const ability = build({
  detectSubjectType: (object) => object.__typename,
});

export { ability, useAbility, abilityBuilder };
