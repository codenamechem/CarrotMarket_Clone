import { useState } from "react";

interface UseMutationState {
  loading: boolean;
  data?: object;
  error?: object;
}

type UseMutationResult = [(data: any) => void, UseMutationState];
//Type설정

export default function useMutation(url: string): UseMutationResult {
  //   const [loading, setLoading] = useState(false);
  //   const [data, setData] = useState<undefined | any>(undefined);
  //   const [error, setError] = useState<undefined | any>(undefined);
  //   function mutation(data: any) {}
  //   return [mutation, { loading, data, error }];
  //    useState 하나로 줄여서 쓰기 가능

  const [state, setState] = useState<UseMutationState>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  function mutation(data: any) {
    setState((prev) => ({ ...prev, loading: true }));

    fetch(url, {
      method: "POST",
      headers: {
        "content-Type": "application/json", //headers 필수로 적어줘야함
      },
      body: JSON.stringify(data), //String 만 받음
    })
      .then((response) => response.json().catch(() => {})) //json이 없으면 반환
      .then((data) => setState((prev) => ({ ...prev, data })))
      .catch((error) => setState((prev) => ({ ...prev, error })))
      .finally(() => setState((prev) => ({ ...prev, loading: false })));
  }
  return [mutation, { ...state }];
}
