export default function generateReducerActions(types) {
  const actions = {};
  for (const type of Object.keys(types)) {
    actions[type] = (payload) => ({ type: type, payload });
  }
  return actions;
}
