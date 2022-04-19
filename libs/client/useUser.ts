import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

export default function useUser() {
  const { data, error } = useSWR("api/users/me");
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter"); //기록에 남기지 않을려면 replace 사용
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}

// Login한 user를 글로벌로 사용가능 하게 Hook 작성

// SWR url을 Key로 사용하여 캐시에 저장하고 fetch할 떄마다 검증을 하여 최신 데이터만 가져오게 만듬 component를 자동으로 갱신
