// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Select from "react-select";

// function StateDropdown({ onSelect, value }) {
//   const [states, setStates] = useState([]);
//   const [selectedState, setSelectedState] = useState(null);
//   const [pageNumber, setPageNumber] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const pageSize = 10;

//   // Fetch states from API
//   const fetchStates = async (page = 0) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:3002/api/states?pageNumber=${page}&pageSize=${pageSize}`
//       );
//       const newStates = res.data.states || [];

//       // Merge and deduplicate states
//       setStates((prevStates) => [
//         ...prevStates,
//         ...newStates.filter((s) => !prevStates.some((st) => st.id === s.id)),
//       ]);

//       setHasMore(newStates.length === pageSize);
//     } catch (err) {
//       console.error("Error fetching states:", err);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchStates(pageNumber);
//   }, [pageNumber]);

//   // Load next page
//   const loadMore = () => {
//     if (hasMore) setPageNumber((prev) => prev + 1);
//   };

//   // Map states to react-select options
//   const options = states.map((state) => ({
//     value: state.id,
//     label: state.state_name,
//   }));

//   // Handle selection
//   const handleChange = (selectedOption) => {
//     setSelectedState(selectedOption);
//     if (onSelect)
//       onSelect({
//         id: selectedOption?.value || null,
//         state_name: selectedOption?.label || "",
//       });
//   };

//   // Preselect value if provided
//   useEffect(() => {
//     if (value && states.length) {
//       const preselected = states.find((s) => s.state_name === value);
//       if (preselected) {
//         setSelectedState({ value: preselected.id, label: preselected.state_name });
//       }
//     }
//   }, [value, states]);

//   return (
//     <div style={{ width: "250px" }}>
//       <Select
//         value={selectedState}
//         onChange={handleChange}
//         options={options}
//         placeholder="Select a state"
//         isClearable
//         isSearchable
//       />
//       {hasMore && (
//         <button onClick={loadMore} style={{ marginTop: "5px", width: "100%" }}>
//           Load More
//         </button>
//       )}
//     </div>
//   );
// }

// export default StateDropdown;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Autocomplete, TextField, Button, CircularProgress, Box } from "@mui/material";

// function StateDropdown({ onSelect, value }) {
//   const [states, setStates] = useState([]);
//   const [selectedState, setSelectedState] = useState(null);
//   const [pageNumber, setPageNumber] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const pageSize = 10;

//   // Fetch states from API
//   const fetchStates = async (page = 0) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `http://localhost:3002/api/states?pageNumber=${page}&pageSize=${pageSize}`
//       );
//       const newStates = res.data.states || [];

//       // Merge and deduplicate states
//       setStates((prevStates) => [
//         ...prevStates,
//         ...newStates.filter((s) => !prevStates.some((st) => st.id === s.id)),
//       ]);

//       setHasMore(newStates.length === pageSize);
//     } catch (err) {
//       console.error("Error fetching states:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchStates(pageNumber);
//   }, [pageNumber]);

//   // Load next page
//   const loadMore = () => {
//     if (hasMore) setPageNumber((prev) => prev + 1);
//   };

//   // Handle selection
//   const handleChange = (event, newValue) => {
//     setSelectedState(newValue);
//     if (onSelect)
//       onSelect({
//         id: newValue?.id || null,
//         state_name: newValue?.state_name || "",
//       });
//   };

//   // Preselect value if provided
//   useEffect(() => {
//     if (value && states.length) {
//       const preselected = states.find((s) => s.state_name === value);
//       if (preselected) {
//         setSelectedState(preselected);
//       }
//     }
//   }, [value, states]);

//   return (
//     <Box sx={{ width: 300 }}>
//       <Autocomplete
//         value={selectedState}
//         onChange={handleChange}
//         options={states}
//         getOptionLabel={(option) => option.state_name}
//         isOptionEqualToValue={(option, val) => option.id === val.id}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Select a state"
//             variant="outlined"
//             InputProps={{
//               ...params.InputProps,
//               endAdornment: (
//                 <>
//                   {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                   {params.InputProps.endAdornment}
//                 </>
//               ),
//             }}
//           />
//         )}
//         clearOnEscape
//       />
//       {hasMore && (
//         <Button
//           variant="outlined"
//           onClick={loadMore}
//           fullWidth
//           sx={{ mt: 1 }}
//           disabled={loading}
//         >
//           Load More
//         </Button>
//       )}
//     </Box>
//   );
// }

// export default StateDropdown;

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { Autocomplete, TextField, CircularProgress, Box } from "@mui/material";

// function StateDropdown({ onSelect, value }) {
//   const [states, setStates] = useState([]);
//   const [selectedState, setSelectedState] = useState(null);
//   const [pageNumber, setPageNumber] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const pageSize = 10;
//   const listboxRef = useRef();

//   // Fetch states from API
//   const fetchStates = async (page = 0) => {
//     if (!hasMore && page > 0) return; // No more data
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `http://localhost:3002/api/states?pageNumber=${page}&pageSize=${pageSize}`
//       );
//       const newStates = res.data.states || [];

//       // Merge and deduplicate
//       setStates((prevStates) => [
//         ...prevStates,
//         ...newStates.filter((s) => !prevStates.some((st) => st.id === s.id)),
//       ]);

//       setHasMore(newStates.length === pageSize);
//     } catch (err) {
//       console.error("Error fetching states:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchStates(pageNumber);
//   }, [pageNumber]);

//   // Handle selection
//   const handleChange = (event, newValue) => {
//     setSelectedState(newValue);
//     if (onSelect)
//       onSelect({
//         id: newValue?.id || null,
//         state_name: newValue?.state_name || "",
//       });
//   };

//   // Preselect value if provided
//   useEffect(() => {
//     if (value && states.length) {
//       const preselected = states.find((s) => s.state_name === value);
//       if (preselected) {
//         setSelectedState(preselected);
//       }
//     }
//   }, [value, states]);

//   // Infinite scroll
//   const handleScroll = (event) => {
//     const listboxNode = event.currentTarget;
//     if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1) {
//       if (hasMore && !loading) {
//         setPageNumber((prev) => prev + 1);
//       }
//     }
//   };

//   return (
//     <Box sx={{ width: 300 }}>
//       <Autocomplete
//         value={selectedState}
//         onChange={handleChange}
//         options={states}
//         getOptionLabel={(option) => option.state_name}
//         isOptionEqualToValue={(option, val) => option.id === val.id}
//         onOpen={() => {
//           // If no data loaded yet, fetch first page
//           if (states.length === 0) fetchStates(0);
//         }}
//         ListboxProps={{
//           onScroll: handleScroll,
//           ref: listboxRef,
//           style: { maxHeight: "200px", overflow: "auto" },
//         }}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Select a state"
//             variant="outlined"
//             InputProps={{
//               ...params.InputProps,
//               endAdornment: (
//                 <>
//                   {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                   {params.InputProps.endAdornment}
//                 </>
//               ),
//             }}
//           />
//         )}
//         clearOnEscape
//       />
//     </Box>
//   );
// }

// export default StateDropdown;
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Autocomplete, TextField, CircularProgress, Box } from "@mui/material";

function StateDropdown({ onSelect, value }) {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;
  const listboxRef = useRef();

  // ✅ Memoized fetchStates to prevent unnecessary re-creations
  const fetchStates = useCallback(
    async (page = 0) => {
      if (!hasMore && page > 0) return; // No more data
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3002/api/states?pageNumber=${page}&pageSize=${pageSize}`
        );
        const newStates = res.data.states || [];

        // Merge and deduplicate
        setStates((prevStates) => [
          ...prevStates,
          ...newStates.filter((s) => !prevStates.some((st) => st.id === s.id)),
        ]);

        setHasMore(newStates.length === pageSize);
      } catch (err) {
        console.error("Error fetching states:", err);
      } finally {
        setLoading(false);
      }
    },
    [hasMore] // dependencies
  );

  // ✅ Initial fetch (runs on pageNumber change)
  useEffect(() => {
    fetchStates(pageNumber);
  }, [fetchStates, pageNumber]);

  // Handle selection
  const handleChange = (event, newValue) => {
    setSelectedState(newValue);
    if (onSelect) {
      onSelect({
        id: newValue?.id || null,
        state_name: newValue?.state_name || "",
      });
    }
  };

  // ✅ Preselect value if provided
  useEffect(() => {
    if (value && states.length) {
      const preselected = states.find((s) => s.state_name === value);
      if (preselected) {
        setSelectedState(preselected);
      }
    }
  }, [value, states]);

  // Infinite scroll handler
  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - 1
    ) {
      if (hasMore && !loading) {
        setPageNumber((prev) => prev + 1);
      }
    }
  };

  return (
    <Box sx={{ width: 300 }}>
      <Autocomplete
        value={selectedState}
        onChange={handleChange}
        options={states}
        getOptionLabel={(option) => option.state_name}
        isOptionEqualToValue={(option, val) => option.id === val.id}
        onOpen={() => {
          // If no data loaded yet, fetch first page
          if (states.length === 0) fetchStates(0);
        }}
        ListboxProps={{
          onScroll: handleScroll,
          ref: listboxRef,
          style: { maxHeight: "200px", overflow: "auto" },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a state"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        clearOnEscape
      />
    </Box>
  );
}

export default StateDropdown;
