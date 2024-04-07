export abstract class Entity<T> {
  public initialProps: T;
  public props: T;

  constructor(props: T) {
    this.initialProps = { ...props };
    this.props = { ...props };

    Object.freeze(this.initialProps);
  }

  update(webinar: Partial<T>): void {
    this.props = { ...this.props, ...webinar };
  }

  commit(): void {
    this.initialProps = { ...this.props };
  }
}