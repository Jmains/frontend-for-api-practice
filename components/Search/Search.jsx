import { useMemo, useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";

export default function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState([]);

  const debouncedHandleSearchChange = useCallback(
    debounce((text) => setSearchInput(text), 400),
    []
  );

  const handleSearchChange = (ev) => {
    debouncedHandleSearchChange(ev.target.value);
  };

  useEffect(() => {
    return () => debouncedHandleSearchChange.cancel();
  }, [debouncedHandleSearchChange]);

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const res = await fetch("http://localhost:8080/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchTerm: searchInput }),
        });

        const data = await res.json();
        console.log("search called");
        await setSearchData(data);
      } catch (err) {
        console.log("something went wrong: ", err);
      }
    };

    fetchSearch();
    if (searchInput && searchInput.length > 0) {
    }
  }, [searchInput]);

  return (
    <>
      <label htmlFor="search">Search</label>
      <input
        // value={searchInput}
        onChange={handleSearchChange}
        type="text"
        name="search"
        id="search"
      />
      {searchData && <pre>{JSON.stringify(searchData, null, 2)}</pre>}
    </>
  );
}
