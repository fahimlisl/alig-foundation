let refreshInFlight: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {

    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
        try {
            const res = await fetch("/api/admin/refresh-token", { method: "POST" });
            return res.ok;
        } catch {
            return false;
        } finally {
            refreshInFlight = null;
        }
    })();

    return refreshInFlight;
}

export async function adminFetch(
    input: string,
    init: RequestInit = {}
): Promise<Response> {
    const response = await fetch(input, init);

    if (response.status !== 401) {
        return response;
    }
    // access token expired (or missing) — attempt a silent refresh
    const refreshed = await refreshAccessToken();

    if (!refreshed) {
        console.log("are we being called from here line 43 ")
        // refresh token is also dead — force a real login
        if (typeof window !== "undefined") {
            window.location.href = "/admin/auth";
        }
        return response; // original 401, caller can still handle it if needed
    }

    // retry the original request exactly once with the newly-set cookies
    return fetch(input, init);
}