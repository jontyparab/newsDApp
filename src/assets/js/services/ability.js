import { Ability, AbilityBuilder } from '@casl/ability';
import { useAbility } from '@casl/vue';

// const Actions = 'create' | 'read' | 'update' | 'delete';
// const Subjects = 'Article' | 'User';

const abilityBuilder = new AbilityBuilder(Ability);
const { can, cannot, rules, build } = abilityBuilder;

can('read', 'News');

const ability = build({
  detectSubjectType: (object) => object.__typename,
});

const CAN = function (...args) {
  can(...args);
  ability.update(rules);
};

const CANNOT = function (...args) {
  cannot(...args);
  ability.update(rules);
};

export { ability, useAbility, abilityBuilder, CAN, CANNOT };
