import toas, { toast } from 'react-toastify';
import { inject, injectable } from 'tsyringe';
import {
  IColorThemeService,
  IToastService,
  ToastContent,
  ToastOptions,
  ToastPromiseParams,
  UpdateOptions,
} from '@hubai/core';

@injectable()
export class ToastService implements IToastService {
  constructor(
    @inject('IColorThemeService')
    private readonly themeService: IColorThemeService
  ) {}

  show<TData = unknown>(
    content: ToastContent<TData>,
    options?: ToastOptions<TData> | undefined
  ): string {
    return toast(
      content as any,
      this.mergeWithDefaultOptions(options)
    ) as string;
  }

  promise<TData = unknown, TError = unknown, TPending = unknown>(
    promise: Promise<TData> | (() => Promise<TData>),
    { pending, error, success }: ToastPromiseParams<TData, TError, TPending>,
    options?: ToastOptions<unknown> | undefined
  ): Promise<TData> {
    return toast.promise(
      promise,
      { pending, error, success } as any,
      this.mergeWithDefaultOptions(options)
    );
  }

  success<TData = unknown>(
    content: ToastContent<TData>,
    options?: ToastOptions<TData> | undefined
  ): string {
    return toast.success(
      content as any,
      this.mergeWithDefaultOptions(options) as any
    ) as string;
  }

  info<TData = unknown>(
    content: ToastContent<TData>,
    options?: ToastOptions<TData> | undefined
  ): string {
    return toast.info(
      content as any,
      this.mergeWithDefaultOptions(options) as any
    ) as string;
  }

  warn<TData = unknown>(
    content: ToastContent<TData>,
    options?: ToastOptions<TData> | undefined
  ): string {
    return toast.warn(
      content as any,
      this.mergeWithDefaultOptions(options) as any
    ) as string;
  }

  error<TData = unknown>(
    content: ToastContent<TData>,
    options?: ToastOptions<TData> | undefined
  ): string {
    return toast.error(
      content as any,
      this.mergeWithDefaultOptions(options) as any
    ) as string;
  }

  update<TData = unknown>(
    toastId: string,
    options: UpdateOptions<TData>
  ): void {
    toast.update(toastId, options as any);
  }

  mergeWithDefaultOptions<TData = unknown>(
    options?: ToastOptions<TData>
  ): toas.ToastOptions {
    return {
      ...(options || {}),
      theme: this.themeService.getColorThemeMode(),
      pauseOnFocusLoss: false,
    } as toas.ToastOptions;
  }

  dismiss(toastId?: string | undefined): void {
    toast.dismiss(toastId);
  }

  isActive(toastId: string): boolean {
    return toast.isActive(toastId);
  }
}
