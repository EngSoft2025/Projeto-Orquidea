export interface OrcidSearchResultItem {
  "orcid-id": string;
  "given-names": string | null;
  "family-names": string | null;
  "credit-name": string | null;
  "other-name": string[];
  email: string[];
  "institution-name": string[];
}

export interface OrcidSearchResult {
  "expanded-result": OrcidSearchResultItem[];
  "num-found": number;
}

export async function fetchOrcidSearch(
  query: string
): Promise<OrcidSearchResult> {
  console.log(query);
  const url = new URL("https://pub.orcid.org/v3.0/expanded-search");
  url.searchParams.set("q", query);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching ORCID data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch ORCID data:", error);
    throw error;
  }
}
