// import { text } from '@formkit/inputs'

// /* In this file, export your final config.
// It will automatically be injected into the playground for you.
// Imports from other playground files are supported. */

// // Adds artbitrary prop "seconds" to the text input definition:
// text.props = ['seconds']

// export default {
//   inputs: {
//     text
//   },
//   config: {
//     /* rootClasses produces the default classes for each element on boot.
//     It is also run reactively for observed properties of the node
//     such as node.props, node.store and node.value */
//     rootClasses (sectionKey, node) {
//       return {
//         [`formkit-${sectionKey}`]: true,
//         ['red']: node.props.seconds % 2 === 0
//       }
//     }
//   }
// }

// OR for per node type basis
// import { DefaultConfigOptions } from '@formkit/vue';

// const config: DefaultConfigOptions = {
//   config: {
//     rootClasses(sectionKey, node) {
//       const type = node.props.type;
//       const classConfig = {
//         outer: 'mb-5',
//         legend: 'block mb-1 font-bold',
//         label() {
//           if (type === 'text') {
//             return 'block mb-1 font-bold';
//           }
//           if (type === 'radio') {
//             return 'text-sm text-gray-600 mt-0.5';
//           }
//         },
//         options() {
//           if (type === 'radio') {
//             return 'flex flex-col flex-grow mt-2';
//           }
//         },
//         input() {
//           if (type === 'text') {
//             return 'w-full h-10 px-3 mb-2 text-base text-gray-700 placeholder-gray-400 border rounded-lg focus:shadow-outline';
//           }
//           if (type === 'radio') {
//             return 'mr-2';
//           }
//         },
//         wrapper() {
//           if (type === 'radio') {
//             return 'flex flex-row flex-grow';
//           }
//         },
//         message: 'text-red-500 text-xs',
//         help: 'text-xs text-gray-500',
//       };

//       function createClassObject(classesArray) {
//         if (!classesArray) return '';
//         const classList = {};
//         classesArray.split(' ').forEach((className) => {
//           classList[className] = true;
//         });
//         return classList;
//       }

//       const target = classConfig[sectionKey];
//       if (typeof target === 'string') {
//         return createClassObject(target);
//       } else if (typeof target === 'function') {
//         return createClassObject(classConfig[sectionKey]());
//       }
//     },
//   },
// };

// export default config;
