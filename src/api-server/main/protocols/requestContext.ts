export interface IRequestContext {
  userId: string;
}

export interface IRequest {
  context: IRequestContext;
}
