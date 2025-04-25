import { ref, Ref } from 'vue';

interface UseMutationOptions<TData = any, TArgs = any> {
  mutationFn: (...args: TArgs[]) => Promise<TData>;
  onSuccess?: (data: Ref<TData | undefined>) => void;
  onError?: (error: Ref<unknown>) => void;
}

export const useMutation = <TData = any, TArgs = any>({
  mutationFn,
  onSuccess,
  onError
}: UseMutationOptions<TData, TArgs>) => {
  const data: Ref<TData | undefined> = ref();
  const isLoading = ref(false);
  const error: Ref<unknown> = ref(null);

  const mutation = async (...args: TArgs[]) => {
    isLoading.value = true;

    try {
      data.value = await mutationFn(...args);
      error.value = null;
      onSuccess?.(data);
    } catch (e) {
      error.value = e;
      onError?.(error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    data,
    isLoading,
    error,
    mutation
  };
};
