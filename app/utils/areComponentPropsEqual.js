import pickBy from 'lodash/pickBy';
import isEqual from 'lodash/isEqual';

export default function areComponentPropsEqual(prevProps, nextProps) {
  const notFuncDelegator = (value) => typeof value !== 'function';

  const prevPropsFiltered = pickBy(prevProps, notFuncDelegator);
  const nextPropsFiltered = pickBy(nextProps, notFuncDelegator);

  return isEqual(prevPropsFiltered, nextPropsFiltered);
}
