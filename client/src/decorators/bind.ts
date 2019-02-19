// prettier-ignore
export default function bind(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // In IE11 calling Object.defineProperty has a side-effect of evaluating the
  // getter for the property which is being replaced. This causes infinite
  // recursion and an "Out of stack space" error.
  let definingProperty = false;
  const originalFn = descriptor.value;

  return {
    configurable: true,
    get() {
      if (definingProperty) {
        return originalFn;
      }

      const value = originalFn.bind(this);

      definingProperty = true;
      Object.defineProperty(this, propertyKey, {
        value,
        configurable: true,
        writable: true,
      });
      definingProperty = false;

      return value;
    },
  };
}
