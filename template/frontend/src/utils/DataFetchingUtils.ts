export const getDefaultHeaders = () => {
    return {
        'X-Requested-With': `${import.meta.env.DEPLOYMENT_KEY}`,
    };
};

// From Here: https://stackoverflow.com/a/20392392
export const isJSON = (jsonString: string | undefined) => {
    try {
        var o = JSON.parse(jsonString ?? '');

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === 'object') {
            return o;
        }
    } catch (_) {}

    return false;
};

export async function getSiteData<T>(
    urlToFetch: string,
): Promise<{ data: T; isError: false } | { data: null; isError: true }> {
    const response = await fetch(urlToFetch, {
        headers: getDefaultHeaders(),
    });

    if (!response.ok) {
        console.error(`Could not get site data for url=${urlToFetch}`);

        return {
            data: null,
            isError: true,
        };
    }

    const text = await response.text();
    const jsonText = isJSON(text);

    if (jsonText) {
        return {
            data: jsonText as T,
            isError: false,
        };
    }

    console.error(
        `Site data for url=${urlToFetch} is not in JSON format, showing error page instead.`,
    );

    return {
        data: null,
        isError: true,
    };
}
