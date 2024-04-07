export interface IExecutable<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>
}