import { ComponentType, ReactElement } from 'react';

export const withProvider =
  <T extends object>(...providers: ComponentType<any>[]) =>
  (WrappedComponent: ComponentType<any>) =>
  (props: T): ReactElement =>
    providers.reduceRight(
      (CombinedProvider, Provider) => <Provider>{CombinedProvider}</Provider>,
      <WrappedComponent {...props} />
    );

export default withProvider;
